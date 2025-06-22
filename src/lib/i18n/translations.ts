import { common } from './translations/common';
import { dashboardTranslations } from './translations/dashboard';
import { thoughtsTranslations } from './translations/thoughts';
import { commitmentsTranslations } from './translations/commitments';

export const translations = {
  en: {
    ...common.en,
    ...dashboardTranslations.en,
    ...thoughtsTranslations.en,
    ...commitmentsTranslations.en,
    faq: {
      title: "Frequently Asked Questions",
      q1: "What is Brain Dump?",
      a1: "Brain Dump is a simple tool to help you clear your mind by capturing all your thoughts, tasks, and ideas in one place.",
      q2: "How do I use Brain Dump effectively?",
      a2: "Just write down whatever is on your mind without worrying about organization. You can later review and clarify these thoughts into actionable commitments.",
      q3: "What happens after I capture my thoughts?",
      a3_1: "Review your thoughts regularly",
      a3_2: "Clarify them into specific commitments",
      a3_3: "Track their completion status",
      q4: "How do I turn thoughts into commitments?",
      a4: "When you're ready to act on a thought:",
      a4_1: "Click the 'Clarify' button on any thought",
      a4_2: "Define the specific outcome and next action",
      a4_desc: "This helps turn vague ideas into concrete, actionable steps.",
      q5: "Can I organize my thoughts?",
      a5: "Yes, you can add tags to your thoughts and filter them later. This helps you group related thoughts together.",
      q6: "What is my Device UUID and how does it secure my data?",
      a6: "Your Device UUID (Universally Unique Identifier) is a secure way to keep your data private:",
      a6_1: "Each device gets its own unique identifier that's automatically generated and stored locally",
      a6_2: "Your thoughts and commitments are only accessible from the device where they were created",
      a6_3: "This ensures your data remains private and separate from other users without requiring an account"
    },
    brainDump: {
      title: "Brain Dump Time!",
      description: "Got thoughts? Toss 'em in below — no need to sort or polish. Just unload and breathe.",
      placeholder: "What's on your mind?",
      addTags: "Add tags (optional) - press Enter to add",
      capture: "Capture Thought",
      thoughtCaptured: "Your thought has been safely stored."
    },
    index: {
      step1: {
        title: "Brain Dump",
        description: "Brain Dump Time! Got thoughts? Toss 'em in below — no need to sort or polish. Just unload and breathe."
      },
      step2: {
        title: "Review Your Active Commitments",
        description: "Track and manage your ongoing commitments"
      }
    }
  },
  ar: {
    ...common.ar,
    ...dashboardTranslations.ar,
    ...thoughtsTranslations.ar,
    ...commitmentsTranslations.ar,
    faq: {
      title: "الأسئلة الشائعة",
      q1: "ما هو تفريغ الأفكار؟",
      a1: "تفريغ الأفكار هو أداة بسيطة تساعدك على تصفية ذهنك من خلال تسجيل جميع أفكارك ومهامك وأفكارك في مكان واحد",
      q2: "كيف أستخدم تفريغ الأفكار بشكل فعال؟",
      a2: "فقط اكتب ما يدور في ذهنك دون القلق بشأن التنظيم. يمكنك لاحقاً مراجعة وتوضيح هذه الأفكار وتحويلها إلى التزامات قابلة للتنفيذ",
      q3: "ماذا يحدث بعد تسجيل أفكاري؟",
      a3_1: "راجع أفكارك بانتظام",
      a3_2: "وضحها وتحولها إلى التزامات محددة",
      a3_3: "تتبع حالة إكمالها",
      q4: "كيف أحول الأفكار إلى التزامات؟",
      a4: "عندما تكون مستعداً للعمل على فكرة ما:",
      a4_1: "انقر على زر 'توضيح' على أي فكرة",
      a4_2: "حدد النتيجة المحددة والإجراء التالي",
      a4_desc: "هذا يساعد في تحويل الأفكار الغامضة إلى خطوات ملموسة وقابلة للتنفيذ.",
      q5: "هل يمكنني تنظيم أفكاري؟",
      a5: "نعم، يمكنك إضافة وسوم لأفكارك وتصفيتها لاحقاً. هذا يساعدك في تجميع الأفكار المرتبطة معاً.",
      q6: "ما هو معرف جهازي الفريد وكيف يؤمن بياناتي؟",
      a6: "معرف جهازك الفريد (UUID) هو طريقة آمنة للحفاظ على خصوصية بياناتك:",
      a6_1: "يحصل كل جهاز على معرف فريد خاص به يتم إنشاؤه تلقائياً وتخزينه محلياً",
      a6_2: "لا يمكن الوصول إلى أفكارك والتزاماتك إلا من الجهاز الذي تم إنشاؤها فيه",
      a6_3: "هذا يضمن بقاء بياناتك خاصة ومنفصلة عن المستخدمين الآخرين دون الحاجة إلى حساب"
    },
    brainDump: {
      title: "سجل أفكارك",
      description: "صفِّ ذهنك من خلال تسجيل أي أفكار أو مهام غير مكتملة هنا",
      placeholder: "ما الذي يدور في ذهنك؟",
      addTags: "أضف وسوماً (اختياري) - اضغط Enter للإضافة",
      capture: "تسجيل الفكرة",
      thoughtCaptured: "تم حفظ فكرتك بأمان."
    },
    index: {
      step1: {
        title: "تفريغ الأفكار",
        description: "ابدأ بتسجيل جميع أفكارك أدناه. لا تقلق بشأن تنظيمها الآن - فقط أخرجها من رأسك."
      },
      step2: {
        title: "مراجعة التزاماتك النشطة",
        description: "تتبع وإدارة التزاماتك المستمرة."
      }
    }
  }
};
