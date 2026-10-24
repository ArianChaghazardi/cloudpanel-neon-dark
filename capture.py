#!/usr/bin/env python3
import socket, os, json, time, base64, urllib.request, subprocess

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
        # ws://127.0.0.1:9222/devtools/page/...
        parts = ws_url.replace('ws://', '').split('/', 1)
        host_port = parts[0]
        self.path = '/' + parts[1]
        host, port = host_port.split(':')
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect((host, int(port)))
        
        # Handshake
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
        
        # Read until matching id
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

def main():
    os.makedirs('/home/pachim/.gemini/antigravity-cli/scratch/cloudpanel-neon-dark/preview', exist_ok=True)
    subprocess.run(["pkill", "-9", "-f", "google-chrome"], stderr=subprocess.DEVNULL)
    time.sleep(0.5)

    # 1. Start headless Chrome
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

    try:
        # Find page target
        list_req = urllib.request.urlopen('http://127.0.0.1:9222/json/list')
        targets = json.loads(list_req.read().decode('utf-8'))
        page_target = next(t for t in targets if t.get('type') == 'page')
        ws_url = page_target['webSocketDebuggerUrl']
        print(f"Connecting to CDP: {ws_url}")
        
        client = CDPClient(ws_url)
        client.send_cmd('Network.enable')
        client.send_cmd('Page.enable')
        
        # Set authentication cookie
        host = os.environ.get('CLOUDPANEL_HOST', '193.151.158.218:8443')
        cookie_val = os.environ.get('CLOUDPANEL_COOKIE', '')
        domain = host.split(':')[0]

        if cookie_val:
            client.send_cmd('Network.setCookie', {
                'name': 'cloudpanel',
                'value': cookie_val,
                'domain': domain,
                'path': '/',
                'secure': True,
                'httpOnly': True
            })
            print("✓ Authentication cookie set.")

        pages_to_test = [
            ('dashboard', f'https://{host}/dashboard'),
            ('sites_list', f'https://{host}/'),
            ('site_settings', f'https://{host}/site/arianchaghazardi.ir/settings'),
            ('site_vhost', f'https://{host}/site/arianchaghazardi.ir/vhost'),
            ('site_databases', f'https://{host}/site/arianchaghazardi.ir/databases'),
            ('site_logs', f'https://{host}/site/arianchaghazardi.ir/logs'),
            ('site_new', f'https://{host}/site/new'),
            ('admin_users', f'https://{host}/admin/users'),
            ('admin_services', f'https://{host}/admin/services'),
            ('admin_settings', f'https://{host}/admin/instance/settings')
        ]

        # Test desktop resolution 1440x900
        client.send_cmd('Emulation.setDeviceMetricsOverride', {
            'width': 1440,
            'height': 900,
            'deviceScaleFactor': 1,
            'mobile': False
        })

        for name, url in pages_to_test:
            print(f"Capturing Desktop: {name} ({url})")
            client.send_cmd('Page.navigate', {'url': url})
            time.sleep(2.5) # Wait for page and charts/vitals
            shot = client.send_cmd('Page.captureScreenshot', {'format': 'png'})
            if shot and 'result' in shot and 'data' in shot['result']:
                out_path = f"/home/pachim/.gemini/antigravity-cli/scratch/cloudpanel-neon-dark/preview/desktop_{name}.png"
                with open(out_path, 'wb') as f:
                    f.write(base64.b64decode(shot['result']['data']))
                print(f"  ✓ Saved: {out_path}")

        # Test mobile resolution 390x844 (iPhone 14)
        client.send_cmd('Emulation.setDeviceMetricsOverride', {
            'width': 390,
            'height': 844,
            'deviceScaleFactor': 2,
            'mobile': True
        })

        mobile_pages = [
            ('dashboard', f'https://{host}/dashboard'),
            ('sites_list', f'https://{host}/'),
            ('site_settings', f'https://{host}/site/arianchaghazardi.ir/settings'),
            ('admin_services', f'https://{host}/admin/services')
        ]

        for name, url in mobile_pages:
            print(f"Capturing Mobile: {name} ({url})")
            client.send_cmd('Page.navigate', {'url': url})
            time.sleep(2.0)
            shot = client.send_cmd('Page.captureScreenshot', {'format': 'png'})
            if shot and 'result' in shot and 'data' in shot['result']:
                out_path = f"/home/pachim/.gemini/antigravity-cli/scratch/cloudpanel-neon-dark/preview/mobile_{name}.png"
                with open(out_path, 'wb') as f:
                    f.write(base64.b64decode(shot['result']['data']))
                print(f"  ✓ Saved: {out_path}")

    finally:
        proc.terminate()
        print("Chrome closed.")

if __name__ == '__main__':
    main()
