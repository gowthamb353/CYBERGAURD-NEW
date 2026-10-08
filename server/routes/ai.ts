import { Router, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { aiCoachLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Initialize server-side Gemini client
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && !apiKey.includes('MY_GEMINI_API_KEY')) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('[AI] Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback tactical guidance if API is unreachable or exhausted
const FALLBACK_TIPS: Record<string, string[]> = {
  en: [
    'Look closely at the sender\'s email domain. Is it an exact match for the official organization, or is there an altered character, strange subdomain, or odd TLD?',
    'Urgency and panic are classic manipulation levers. Legitimate institutions rarely demand immediate card CVV or PIN entries within 2 hours.',
    'Before tapping on any link or attachment, inspect the actual destination URL. Never open unverified .exe, .zip, or .scr attachments.',
    'For password security, length combined with diverse characters beats simple dictionary words every time.',
  ],
  hi: [
    'प्रेषक के ईमेल डोमेन की सावधानीपूर्वक जांच करें। क्या यह आधिकारिक संगठन से मिलता-जुलता एक फर्जी डोमेन है?',
    'तात्कालिकता और घबराहट धोखाधड़ी के सामान्य संकेत हैं। बैंक कभी भी 2 घंटे के भीतर पिन या सीवीवी नहीं मांगते।',
    'किसी भी लिंक पर क्लिक करने से पहले यूआरएल की जांच करें। कभी भी अज्ञात .exe या .zip फ़ाइलें न खोलें।',
  ],
  ta: [
    'அனுப்புநரின் மின்னஞ்சல் முகவரியைச் சரிபார்க்கவும். போலி எழுத்துக்கள் அல்லது சந்தேகத்திற்கிடமான முகவரிகள் உள்ளதா?',
    'அவசரப்படுத்தும் கோரிக்கைகளை நம்பாதீர்கள். வங்கிகள் ஒருபோதும் அவசரமாக PIN அல்லது CVV கேட்காது.',
    'எந்தவொரு இணைப்பையும் தொடும் முன் அதன் முகவரியைச் சரிபார்க்கவும்.',
  ],
  te: [
    'పంపినవారి ఇమెయిల్ డొమైన్‌ను జాగ్రత్తగా గమనించండి. ఇది నకిలీ డొమైన్ కావచ్చు.',
    'అత్యవసరంగా చేయాలనే ఒత్తిడి మోసాల యొక్క సాధారణ లక్షణం.',
    'ఏదైనా లింక్‌ను నొక్కే ముందు అసలు చిరునామాను సరిచూసుకోండి.',
  ],
  es: [
    'Verifica con atención el dominio del remitente. ¿Tiene letras cambiadas o un dominio de nivel superior sospechoso?',
    'La urgencia extrema suele ser una trampa. Los bancos nunca piden tu PIN o CVV por correo electrónico.',
    'Comprueba siempre la URL real antes de pulsar. Desconfía de archivos descargables desconocidos.',
  ],
  fr: [
    'Examinez attentivement le nom de domaine de l\'expéditeur. Y a-t-il une anomalie ou un sous-domaine douteux ?',
    'L\'urgence artificielle est l\'arme numéro un des pirates. Ne communiquez jamais de code secret ou CVV.',
    'Vérifiez la destination réelle d\'un lien avant d\'interagir.',
  ],
  ar: [
    'دقق في نطاق البريد الإلكتروني للمرسل. هل يحتوي على أحرف متبدلة أو نطاق غريب؟',
    'الاستعجال الشديد هو الأسلوب الأبرز للمحتالين. البنوك لا تطلب أبداً رمزك السري عبر البريد.',
    'تحقق دائماً من الرابط الفعلي قبل النقر ولا تفتح ملفات غير موثوقة.',
  ],
};

function getRandomFallbackTip(lang = 'en'): string {
  const list = FALLBACK_TIPS[lang] || FALLBACK_TIPS.en;
  return list[Math.floor(Math.random() * list.length)];
}

router.post('/chat', requireAuth, aiCoachLimiter, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, challengeContext, userLanguage = 'en', mode = 'hint' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message payload is required.' });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: 'Message exceeds 500 character limit.' });
    }

    // Language names mapping for the AI
    const languageNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi',
      ta: 'Tamil',
      te: 'Telugu',
      es: 'Spanish',
      fr: 'French',
      ar: 'Arabic',
    };
    const targetLangName = languageNames[userLanguage] || 'English';

    // Strict system prompt: NEVER REVEAL THE CORRECT ANSWER!
    const systemInstruction = `You are the AI Cyber Coach in "Cyber Guardian", an elite cybersecurity mission training game.
Your identity: A sharp, supportive, and tactical cybersecurity adviser.
User Language: Reply strictly in ${targetLangName}. Keep tone direct, practical, and under 120 words.

CRITICAL SECURITY RULES:
1. When the user is solving an active challenge: You MUST NEVER reveal the correct answer or explicitly state "this is a phish" or "this is safe" or provide the exact solution flags.
2. Instead, provide subtle TACTICAL HINTS: Tell them what telemetry or clues to inspect (e.g. "Check the domain extension", "Look at the urgency phrasing", "Inspect if an HTTP link is used").
3. If the user asks for a safety tip or concept explanation: Provide a crisp 2-3 sentence best practice.
4. Keep the answer friendly, engaging, and in ${targetLangName}.`;

    // Only pass safe scenario text to Gemini, NEVER pass correctAnswer
    let contextPrompt = '';
    if (challengeContext) {
      const sanitizedScenario = {
        title: challengeContext.title,
        channel: challengeContext.channel,
        sender: challengeContext.sender,
        subject: challengeContext.subject,
        bodySnippet: challengeContext.body ? String(challengeContext.body).substring(0, 300) : '',
      };
      contextPrompt = `\nActive Challenge Scenario (User is currently examining this):
${JSON.stringify(sanitizedScenario, null, 2)}
Reminder: Guide them with analytical questions without spoiling the answer!`;
    }

    const fullPrompt = `${systemInstruction}\n${contextPrompt}\n\nUser Question: "${message}"\nMode: ${mode}\nRespond in ${targetLangName}:`;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: fullPrompt,
        });

        const reply = response.text?.trim();
        if (reply) {
          return res.json({ reply });
        }
      } catch (geminiError: any) {
        console.warn('[AI] Gemini generation failed, falling back to local guidance:', geminiError.message);
      }
    }

    // Resilient fallback response
    const fallback = getRandomFallbackTip(userLanguage);
    return res.json({ reply: fallback });
  } catch (error: any) {
    console.error('[AI] Coach handler error:', error);
    return res.status(500).json({
      error: 'Cyber Coach is temporarily recalibrating sensors. Please try again shortly.',
      fallback: getRandomFallbackTip(),
    });
  }
});

export default router;
