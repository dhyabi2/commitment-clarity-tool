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
  const { t, dir } = useLanguage();
  
  const isActive = (path: string) => location.pathname === path;

  const getIconSize = (path: string) => {
    if (path === '/thoughts') {
      return 'h-9 w-9'; // Slightly larger for thoughts icon
    }
    return 'h-7 w-7'; // Default size for other icons
  };
  
  const getIconColor = (path: string) => {
    if (path === '/thoughts') {
      return isActive(path) ? 'text-sage-700' : 'text-sage-500';
    }
    return isActive(path) ? 'text-sage-600' : 'text-gray-600';
  };
  
  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/thoughts', icon: Brain, label: t('nav.thoughts') },
    { path: '/completed-commitments', icon: CheckSquare, label: t('nav.completed') },
    { path: '/dashboard', icon: BarChart, label: t('nav.stats') },
    { path: '/faq', icon: HelpCircle, label: t('nav.faq') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:top-0 md:bottom-auto shadow-lg" dir={dir()}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="hidden md:block text-xl font-semibold py-3 text-sage-700">{t('index.step1.title')}</div>
        <div className="flex justify-around items-center py-3">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Tooltip key={path}>
              <TooltipTrigger asChild>
                <Link
                  to={path}
                  className={`p-2 ${getIconColor(path)} hover:text-sage-500 transition-colors`}
                >
                  <Icon className={`${getIconSize(path)} transition-all duration-300`} />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;