# DIGITAL. · هضر معايا

صفحة الشات موجودة فـ `public/chat.html`. رابطها موجود فالمينيو وفأسفل الصفحة الرئيسية بالإنجليزية والفرنسية والعربية. شعار DIGITAL. فصفحة الشات كيرجع للموقع.

## التجربة فالحاسوب

1. فكّ الضغط وافتح الطرفية داخل مجلد المشروع. خاص Node.js.
2. أنشئ ملف `.dev.vars` فجنب `wrangler.jsonc` وكتب فيه `GEMINI_API_KEY=مفتاحك`. استعمل مفتاح جديد من Google AI Studio.
3. شغّل `npx wrangler dev` وافتح الرابط اللي كيعطيك. صفحة الشات كتحتاج المسار `/api/chat` اللي كيشغّلو Worker.
4. إلا عندك `web1.png` و`web2.png` من الموقع الأصلي، حطّهم داخل `public/`. الصفحة الأصلية فيها صور احتياطية.

## النشر على Cloudflare Workers

1. سجّل الدخول باستعمال `npx wrangler login`.
2. نفّذ `npx wrangler secret put GEMINI_API_KEY` ودخّل المفتاح منين يطلبو منك.
3. نفّذ `npx wrangler deploy`. من بعد تقدر تربط الدومين ديالك من إعدادات Worker.

ملف `worker.mjs` كيتصل بـ Gemini من السيرفر. مفتاح Gemini كيبقى فإعدادات السيرفر، وملفات الموقع العامة كاينة داخل `public/`. الشات كيسمح بعشرة طلبات فالدقيقة لكل عنوان IP حسب نقطة وصول Cloudflare.

[إعدادات Cloudflare Workers](https://developers.cloudflare.com/workers/wrangler/configuration/)
