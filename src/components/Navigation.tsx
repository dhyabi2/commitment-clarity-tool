import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Brain, CheckSquare, BarChart, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navigation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/thoughts', icon: Brain, label: t('nav.thoughts') },
    { path: '/completed-commitments', icon: CheckSquare, label: t('nav.completed') },
    { path: '/dashboard', icon: BarChart, label: t('nav.stats') },
    { path: '/faq', icon: HelpCircle, label: t('nav.faq') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 md:top-0 md:bottom-auto shadow-lg">
      <div className="max-w-4xl mx-auto flex justify-around items-center">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Tooltip key={path}>
            <TooltipTrigger asChild>
              <Link
                to={path}
                className={`p-2 ${
                  isActive(path) ? 'text-sage-600' : 'text-gray-600'
                } hover:text-sage-500 transition-colors`}
              >
                <Icon className="h-8 w-8" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;