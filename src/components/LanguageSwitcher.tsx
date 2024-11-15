import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LanguageSwitcher = () => {
  const { language, setLanguage, dir } = useLanguage();
  const isRTL = dir() === 'rtl';

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          className={`fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-50`}
        >
          <Languages className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent dir={isRTL ? 'ltr' : 'rtl'}>
        <p>{language === 'en' ? 'Switch to Arabic' : 'Switch to English'}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default LanguageSwitcher;