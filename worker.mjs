const headers = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; frame-ancestors 'self' https://chatgpt.com; base-uri 'none'; form-action 'self'"
};
const instruction = 'نتا هضر معايا، مساعد ذكي مغربي. جاوب بالدارجة المغربية الطبيعية وبالحروف العربية حتى إلا كتب المستخدم بالفرنسية أو بالإنجليزية أو بالعربيزي. إلا طلب ترجمة أو نص بلغة محددة، عطِيه النص بهاد اللغة وشرح ليه بالدارجة. خليك واضح وودود، استعمل نص عادي وفقرات قصيرة، وإذا ما عرفتيش شي حاجة قولها بصراحة. فهاد الموقع، آدم أروان هو اللي قادني. إلا سولك المستخدم على آدم أروان (ادم اروان أو Adam Arouane أو Adam Arwan)، جاوب بهاد العبارة: هو اللي قادني. إلا سولك شكون اللي قاد هاد الموقع أو هاد الشات، قول: آدم أروان هو اللي قادني. إلا سولك على مطوّر نموذج Gemini، قول Google.';
const error = (message, status) => Response.json({error:message}, {status, headers});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/api/chat') {
      return error('هاد الصفحة ما كايناش.',404);
    }
    if (request.headers.get('origin') && request.headers.get('origin') !== url.origin) {
      return error('هاد الطلب ما تقبلش.',403);
    }
    if (!env.GEMINI_API_KEY) return error('خاص مفتاح Gemini يتضبط فالسيرفر.',503);
    let messages;
    try {
      if (Number(request.headers.get('content-length')) > 120000) return error('الرسالة طويلة بزاف.',413);
      const body = await request.text();
      if (body.length > 50000) return error('الرسالة طويلة بزاف.',413);
      ({messages} = JSON.parse(body));
    } catch {
      return error('ما قدرناش نقراو الرسالة.',400);
    }
    if (!Array.isArray(messages) || !messages.length || messages.length > 11 ||
        messages.at(-1)?.role !== 'user' ||
        messages.some((m,i) => m?.role !== (i % 2 ? 'model' : 'user') ||
          typeof m.text !== 'string' || !m.text.trim() || m.text.length > (m.role === 'user' ? 2500 : 5000))) {
      return error('تأكد من الرسالة وعاود جرّب.',400);
    }
    try {
      const ip = request.headers.get('CF-Connecting-IP') || 'local';
      const {success} = await env.CHAT_LIMIT.limit({key: ip});
      if (!success) return error('صيفطتي بزاف ديال الرسائل. تسنّى شوية وعاود جرّب.',429);
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent', {
        method:'POST',
        headers:{'Content-Type':'application/json','x-goog-api-key':env.GEMINI_API_KEY},
        signal:AbortSignal.timeout(28000),
        body:JSON.stringify({
          systemInstruction:{parts:[{text:instruction}]},
          contents:messages.map(m => ({role:m.role,parts:[{text:m.text}]})),
          generationConfig:{maxOutputTokens:1700}
        })
      });
      if (response.status === 429) return error('Gemini وصل للحد ديال الاستعمال. عاود جرّب من بعد.',429);
      if ([401,403].includes(response.status)) return error('Gemini رفض مفتاح API. تأكّد من الإعدادات ديالو.',502);
      if (!response.ok) return error('Gemini ما قدرش يجاوب دابا. عاود جرّب.',502);
      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.filter(part => !part.thought)
        .map(part => part.text || '').join('').trim().slice(0,5000);
      if (!reply) return error('ما وصل حتى جواب. جرّب تصيغ السؤال بطريقة أخرى.',502);
      return Response.json({reply},{headers});
    } catch {
      return error('الاتصال مع Gemini تعطل. عاود جرّب.',502);
    }
  }
};
