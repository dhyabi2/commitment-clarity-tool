import { Card } from "@/components/ui/card";
import FAQContent from "@/components/FAQ";

const FAQ = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-sage-700 mb-6">Frequently Asked Questions</h1>
      <FAQContent />
    </div>
  );
};

export default FAQ;