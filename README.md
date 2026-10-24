# 🌌 CloudPanel Neon Dark Edition

> **A professional, minimalist, high-contrast Dark UI redesign for [CloudPanel](https://www.cloudpanel.io) with multi-theme support and monitoring chart overhauls.**  
> *100% Update-Proof & Non-Destructive (Method 1: Nginx Sub_Filter Injection).*

---

## 💎 ویژگی‌های کلیدی (Key Features)

* **طراحی مدرن، مینیمال و دارک حرفه‌ای (Modern UI/UX):**
  * ترکیب مشکی عمیق (`#07090e`) و خاکستری متالیک مات با رنگ اختصاصی **آبی نئونی الکتریک (`#3b82f6` / `#60a5fa`)**.
  * الهام‌گرفته از استانداردهای طراحی مدرن داشبوردهای Vercel، Linear و Datadog.
  * پنل‌ها و نوبار شیشه‌ای (Glassmorphism با `backdrop-filter: blur(16px)`).
  * حاشیه‌های ظریف، میکرواینتراکشن‌های روان و حلقه‌های فوکوس درخشان برای فیلدها و دکمه‌ها.
  * پشتیبانی کامل از هر دو حالت چپ‌چین (LTR) و راست‌چین/فارسی (RTL).

* **بازطراحی اساسی مانیتورینگ و داشبورد (Monitoring Overhaul):**
  * تبدیل خودکار نمودارهای خطی و ساده Highcharts به **منحنی‌های نرم گرادینت‌دار (Smooth AreaSpline Gradients)**.
  * تولتیپ‌های شیشه‌ای مدرن با سایه و فونت منو-اسپیس برای داده‌های آماری.
  * بازطراحی باکس‌های اطلاعات سیستم (IP، CPU، سیستم‌عامل و رم) با نشانگر وضعیت آنلاین (Pulse Status Indicator).

* **پشتیبانی از چندین تم مختلف (Multi-Theme Engine):**
  * تعبیه یک **Theme Switcher** اختصاصی در بالای نوبار بدون دستکاری کدهای پنل:
    1. ⚡ **Neon Midnight Blue (پیش‌فرض):** مشکی عمیق با نور آبی نئونی و هایلایت‌های شفاف.
    2. 🌊 **Cyber Cyan:** سرمه‌ای تیره با نور فیروزه‌ای و سایبرپانک.
    3. 🌑 **AMOLED Pure:** مشکی ۱۰۰٪ مطلق برای کنتراست بی‌نهایت و مانیتورهای اولد.
  * ذخیره‌سازی تم انتخابی در `localStorage` مرورگر.

* **۱۰۰٪ مقاوم در برابر آپدیت‌های کلودپنل (100% Update-Proof):**
  * بر اساس **روش اول (تزریق از لایه Nginx)**؛ فایل‌های اصلی PHP یا پکیج‌های کلودپنل دستکاری نمی‌شوند.
  * با به‌روزرسانی پکیج رسمی کلودپنل (`apt upgrade` یا `clp-update`)، تغییرات به هیچ وجه پاک نمی‌شوند.
  * دارای هوک اختصاصی در `APT Post-Invoke` برای حفظ خودکار پایداری تنظیمات در تمام آپدیت‌های آتی.

---

## 🚀 نصب سریع با یک دستور (One-Click Installation)

روی سروری که CloudPanel روی آن نصب است، دستور زیر را اجرا کنید:

```bash
git clone https://github.com/ArianChaghazardi/cloudpanel-neon-dark.git /tmp/cloudpanel-neon-dark \
  && sudo bash /tmp/cloudpanel-neon-dark/install.sh \
  && rm -rf /tmp/cloudpanel-neon-dark
```

سپس وارد آدرس پنل کلودپنل خود شوید و کلیدهای **`Ctrl + F5`** (Hard Refresh) را فشار دهید.

---

## 📂 ساختار فایل‌های پروژه (Architecture)

```text
cloudpanel-neon-dark/
├── assets/
│   ├── css/
│   │   ├── variables.css      # توکن‌های طراحی و پالت‌های رنگی ۳ تم مختلف
│   │   ├── base.css           # بازنشانی استایل‌ها، اسکرول‌بار سفارشی و تایپوگرافی
│   │   ├── layout.css         # استایل هدر شیشه‌ای، سایدبار و نویگیشن
│   │   ├── components.css     # کارت‌ها، جداول، اینپوت‌ها، دکمه‌ها و بج‌ها
│   │   ├── dashboard.css      # بازطراحی ویجت‌های مانیتورینگ و داشبورد
│   │   └── theme.css          # استایل‌شیت اصلی برای بارگذاری مستقیم
│   └── js/
│       └── enhancer.js        # موتور سوییچ تم + هوک بازطراحی خودکار Highcharts
├── preview/
│   └── demo.html              # محیط تست تعاملی با نمودارهای زنده و بدون نیاز به سرور
├── install.sh                 # اسکریپت نصب و پیکربندی خودکار Nginx و APT Hook
├── uninstall.sh               # اسکریپت حذف تمیز و بازگشت به حالت اولیه
└── README.md
```

---

## 🛠️ نصب دستی (Manual Setup)

اگر مایل هستید مراحل را به صورت دستی روی سرور انجام دهید:

1. **کپی فایل‌های تم:**
   ```bash
   sudo mkdir -p /home/clp/custom-theme
   sudo cp -r assets/css /home/clp/custom-theme/
   sudo cp -r assets/js /home/clp/custom-theme/
   sudo chown -R clp:clp /home/clp/custom-theme
   ```

2. **پیکربندی Nginx کلودپنل:**
   فایل `/home/clp/services/nginx/sites-enabled/cloudpanel.conf` را باز کرده و قبل از آخرین `}` سرور، کدهای زیر را اضافه کنید:
   ```nginx
   sub_filter_types text/html;
   sub_filter '</head>' '<link rel="stylesheet" href="/clp-custom/css/theme.css"><script defer src="/clp-custom/js/enhancer.js"></script></head>';
   sub_filter_once on;

   location ^~ /clp-custom/ {
       alias /home/clp/custom-theme/;
       access_log off;
       expires 30d;
   }
   ```

3. **راه‌اندازی مجدد سرویس Nginx کلودپنل:**
   ```bash
   sudo systemctl restart clp-nginx
   ```

---

## 🔄 حذف و بازگشت به حالت اولیه (Uninstall)

برای بازگرداندن پنل به حالت اولیه پیش‌فرض کارخانه:
```bash
sudo bash uninstall.sh
```

---

## 🖥️ پیش‌نمایش آفلاین (Interactive Demo)

برای مشاهده و تست زنده تمام بخش‌ها و تم‌ها قبل از پیاده‌سازی روی سرور اصلی، فایل `preview/demo.html` را در هر مرورگری باز کنید.

---

## 📄 مجوز (License)

توسعه‌داده‌شده برای اهداف شخصی و سازمانی. این پروژه مستقل از تیم رسمی CloudPanel بوده و به صورت یک بسته الحاقی غیرمخرب عمل می‌کند.
