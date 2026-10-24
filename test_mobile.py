#!/usr/bin/env python3
import socket, os, json, time, base64, urllib.request, subprocess

CLOUDPANEL_URL = "https://193.151.158.218:8443"
ADMIN_COOKIE = os.environ.get("CLOUDPANEL_COOKIE", "5e5m13l4f2nqksj2ur7arb5e70")

def make_ws_handshake(path, host='127.0.0.1:9222'):
    key = base64.b64encode(os.urandom(16)).decode('utf-8')
    req = (
        f"GET {path} HTTP/1.1\r\n"
        f"Host: {host}\r\n"
        f"Upgrade: websocket\r\n"
        f"Connection: Upgrade\r\n"
        f"Sec-WebSocket-Key: {key}\r\n"
        f"Sec-WebSocket-Version: 13\r\n\r\n"
    )
    return req.encode('utf-8')

def make_frame(text):
    data = text.encode('utf-8')
    mask = os.urandom(4)
    frame = bytearray([0x81])
    n = len(data)
    if n <= 125:
        frame.append(0x80 | n)
    elif n <= 65535:
        frame.append(0x80 | 126)
        frame.extend(n.to_bytes(2, 'big'))
    else:
        frame.append(0x80 | 127)
        frame.extend(n.to_bytes(8, 'big'))
    frame.extend(mask)
    frame.extend(bytes(b ^ mask[i % 4] for i, b in enumerate(data)))
    return bytes(frame)

def recv_frame(sock):
    header = sock.recv(2)
    if not header or len(header) < 2: return None
    b1, b2 = header
    masked = bool(b2 & 0x80)
    length = b2 & 0x7f
    if length == 126:
        length = int.from_bytes(sock.recv(2), 'big')
    elif length == 127:
        length = int.from_bytes(sock.recv(8), 'big')
    mask = sock.recv(4) if masked else None
    data = bytearray()
    while len(data) < length:
        chunk = sock.recv(min(65536, length - len(data)))
        if not chunk: break
        data.extend(chunk)
    if mask:
        data = bytearray(b ^ mask[i % 4] for i, b in enumerate(data))
    return data.decode('utf-8', errors='ignore')

class CDPClient:
    def __init__(self, ws_url):
        parts = ws_url.replace('ws://', '').split('/', 1)
        host_port = parts[0]
        self.path = '/' + parts[1]
        host, port = host_port.split(':')
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect((host, int(port)))
        
        self.sock.sendall(make_ws_handshake(self.path, host_port))
        resp = self.sock.recv(4096).decode('utf-8', errors='ignore')
        if '101' not in resp:
            raise Exception('Failed WS handshake: ' + resp)
        self.msg_id = 1

    def send_cmd(self, method, params=None):
        mid = self.msg_id
        self.msg_id += 1
        payload = {'id': mid, 'method': method, 'params': params or {}}
        self.sock.sendall(make_frame(json.dumps(payload)))
        while True:
            raw = recv_frame(self.sock)
            if not raw: break
            try:
                res = json.loads(raw)
                if res.get('id') == mid:
                    return res
            except:
                pass
        return None

    def eval(self, expr):
        res = self.send_cmd("Runtime.evaluate", {
            "expression": expr,
            "returnByValue": True,
            "awaitPromise": True
        })
        return res.get("result", {}).get("result", {}).get("value")

    def set_viewport(self, width, height, is_mobile=True, scale=1.0):
        self.send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": width,
            "height": height,
            "deviceScaleFactor": scale,
            "mobile": is_mobile
        })

    def screenshot(self, path):
        res = self.send_cmd("Page.captureScreenshot", {"format": "png"})
        b64 = res.get("result", {}).get("data", "")
        if b64:
            with open(path, "wb") as f:
                f.write(base64.b64decode(b64))

    def close(self):
        try: self.sock.close()
        except: pass

def main():
    subprocess.run(["pkill", "-9", "-f", "google-chrome"], stderr=subprocess.DEVNULL)
    time.sleep(0.5)

    proc = subprocess.Popen([
        'google-chrome-stable',
        '--headless=new',
        '--remote-debugging-port=9222',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--ignore-certificate-errors',
        '--window-size=1440,900',
        'about:blank'
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.5)

    tabs = json.loads(urllib.request.urlopen("http://127.0.0.1:9222/json").read())
    page_tab = next(t for t in tabs if t.get("type") == "page")
    client = CDPClient(page_tab["webSocketDebuggerUrl"])
    client.send_cmd("Network.enable")

    # Set auth cookie
    client.send_cmd("Network.setCookie", {
        "name": "cloudpanel",
        "value": ADMIN_COOKIE,
        "domain": "193.151.158.218",
        "path": "/",
        "secure": True,
        "httpOnly": True
    })

    resolutions = [
        ("iphone_14", 390, 844),
        ("galaxy_s20", 360, 800),
        ("desktop_1440", 1440, 900)
    ]

    pages = [
        ("/", "dashboard"),
        ("/site/arianchaghazardi.ir/settings", "site_settings"),
        ("/admin/services", "admin_services"),
        ("/admin/users", "admin_users"),
    ]

    out_dir = "/home/pachim/.gemini/antigravity-cli/brain/3796cd46-696c-4ca5-9e85-8a2bcad0b2e4/mobile_audit"
    os.makedirs(out_dir, exist_ok=True)

    report = []

    for dev_name, w, h in resolutions:
        client.set_viewport(w, h, is_mobile=(w < 768))
        for path, name in pages:
            url = f"{CLOUDPANEL_URL}{path}"
            client.send_cmd("Page.navigate", {"url": url})
            time.sleep(2.5)

            # Check footer presence
            footer_count = client.eval("document.querySelectorAll('footer, .footer').length")
            footer_visible = client.eval("""
                (() => {
                    const el = document.querySelector('footer, .footer');
                    if (!el) return false;
                    const r = el.getBoundingClientRect();
                    const s = window.getComputedStyle(el);
                    return s.display !== 'none' && s.visibility !== 'hidden' && r.height > 0;
                })()
            """)

            # Check horizontal overflow
            scroll_width = client.eval("document.documentElement.scrollWidth || document.body.scrollWidth")
            inner_width = client.eval("window.innerWidth")
            has_h_overflow = (scroll_width > inner_width)

            # Check topbar logo HectorTM
            logo_text = client.eval("document.querySelector('.clp-brand-logo')?.textContent || ''")
            doc_title = client.eval("document.title")

            shot_file = f"{out_dir}/{dev_name}_{name}.png"
            client.screenshot(shot_file)

            status = {
                "device": dev_name,
                "page": path,
                "width": w,
                "scrollWidth": scroll_width,
                "hasHorizontalOverflow": has_h_overflow,
                "footerCount": footer_count,
                "footerVisible": footer_visible,
                "logoText": logo_text,
                "docTitle": doc_title,
                "screenshot": shot_file
            }
            report.append(status)
            print(f"[{dev_name:12} {w}x{h}] {path:35} -> scrollW: {scroll_width} (win: {inner_width}), overflow: {has_h_overflow}, footerCount: {footer_count}, footerVis: {footer_visible}, title: {doc_title}")

    client.close()
    proc.terminate()

    with open(f"{out_dir}/report.json", "w") as f:
        json.dump(report, f, indent=2)
    print("Done! Report saved to", f"{out_dir}/report.json")

if __name__ == "__main__":
    main()
