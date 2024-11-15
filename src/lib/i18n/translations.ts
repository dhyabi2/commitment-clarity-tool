import { commonTranslations } from './translations/common';
import { dashboardTranslations } from './translations/dashboard';
import { thoughtsTranslations } from './translations/thoughts';
import { commitmentsTranslations } from './translations/commitments';

export const translations = {
  en: {
    ...commonTranslations.en,
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
      a5: "Yes, you can add tags to your thoughts and filter them later. This helps you group related thoughts together."
    },
    brainDump: {
      title: "Brain Dump",
      description: "Clear your mind by capturing any unfinished thoughts or tasks here.",
      placeholder: "What's on your mind?",
      addTags: "Add tags (optional) - press Enter to add",
      capture: "Capture Thought",
      thoughtCaptured: "Your thought has been safely stored."
    },
    index: {
      step1: {
        title: "Brain Dump",
        description: "Begin by capturing all your thoughts below. Don't worry about organizing them yet - just get them out of your head."
      },
      step2: {
        title: "Review Your Active Commitments",
        description: "Track and manage your ongoing commitments"
      }
    }
  },
  ar: {
    ...commonTranslations.ar,
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
      a5: "نعم، يمكنك إضافة وسوم لأفكارك وتصفيتها لاحقاً. هذا يساعدك في تجميع الأفكار المرتبطة معاً."
    },
    brainDump: {
      title: "تفريغ الأفكار",
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
