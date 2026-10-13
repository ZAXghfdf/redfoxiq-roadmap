# REDFOXIQ TEAM | Cybersecurity Roadmap

خارطة طريق تفاعلية لتعلم الأمن السيبراني باللغة العربية، مبنية على كورسات منصة Red Team Leaders Academy.

## الموقع

تم بناء الموقع باستخدام HTML5 وCSS3 وJavaScript Vanilla فقط، بدون أي إطار عمل.

## المزايا

- تصميم Dark Mode احترافي
- مسارين تعليميين: RED TEAM و BLUE TEAM مع 6 مراحل لكل مسار
- عرض الكورسات وربطها بالروابط الأصلية
- تتبع التقدم محليًا عبر localStorage
- إضافة للمفضلة
- بحث ذكي
- تصميم متجاوب مع الهاتف والتابلت والكمبيوتر
- دعم RTL كامل

## التشغيل محليًا

يمكن تشغيل الموقع مباشرة بفتح ملف `index.html` في المتصفح، أو باستخدام خادم محلي.

### باستخدام خادم Python

```bash
cd /data/data/com.termux/files/home/projects/redfoxiq-roadmap
python3 -m http.server 8000
```

ثم افتح المتصفح على: `http://localhost:8000`

## هيكل الملفات

```
redfoxiq-roadmap/
├── index.html
├── README.md
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── courses.js
│   ├── storage.js
└── data/
    ├── courses.json
    └── roadmap.json
```

## مصدر البيانات

جميع الكورسات مستندة إلى كتالوج: [courses.redteamleaders.com/catalog](https://courses.redteamleaders.com/catalog)

**ملاحظة:** هذا الموقع تنظيم تعليمي مستقل، وليس صفحة رسمية تابعة للمنصة.

## حقوق النشر

© 2026 REDFOXIQ TEAM
