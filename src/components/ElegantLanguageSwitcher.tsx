
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ElegantLanguageSwitcher = () => {
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
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 h-auto bg-sage-50 hover:bg-sage-100 border border-sage-200 rounded-full transition-all duration-200 text-sage-700 hover:text-sage-800"
        >
          <Globe className="h-4 w-4" />
          <div className="flex items-center gap-1 text-sm font-medium">
            <span className={`px-2 py-1 rounded-full text-xs transition-all duration-200 ${
              language === 'ar' 
                ? 'bg-sage-500 text-white shadow-sm' 
                : 'text-sage-600 hover:bg-sage-200'
            }`}>
              AR
            </span>
            <span className={`px-2 py-1 rounded-full text-xs transition-all duration-200 ${
              language === 'en' 
                ? 'bg-sage-500 text-white shadow-sm' 
                : 'text-sage-600 hover:bg-sage-200'
            }`}>
              EN
            </span>
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ElegantLanguageSwitcher;
