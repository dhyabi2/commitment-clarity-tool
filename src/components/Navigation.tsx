
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Brain, CheckSquare, BarChart, HelpCircle, User } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ElegantLanguageSwitcher from './ElegantLanguageSwitcher';
import PWAInstallIcon from './pwa/PWAInstallIcon';
import PWAInstallPrompt from './pwa/PWAInstallPrompt';
import { usePWAInstallPopup } from '@/hooks/usePWAInstallPopup';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navigation = () => {
  const location = useLocation();
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const {
    isPopupVisible,
    isInstalling,
    showManualInstructions,
    showPopup,
    hidePopup,
    handleInstall,
    isInstallable,
    isInstalled
  } = usePWAInstallPopup();
  
  const isActive = (path: string) => location.pathname === path;

  const getIconSize = (path: string) => {
    if (path === '/thoughts') {
      return 'h-9 w-9';
    }
    return 'h-7 w-7';
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:top-0 md:bottom-auto md:border-t-0 md:border-b shadow-lg z-50" dir={dir()}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between py-3">
            <div className="text-xl font-semibold text-sage-700">{t('index.step1.title')}</div>
            
            {/* Desktop Navigation Items */}
            <div className="flex items-center gap-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Tooltip key={path}>
                  <TooltipTrigger asChild>
                    <Link
                      to={path}
                      className={`p-2 rounded-lg transition-colors ${getIconColor(path)} hover:text-sage-500 hover:bg-sage-50`}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Desktop Right Side Items */}
            <div className="flex items-center gap-3">
              {/* PWA Install Icon */}
              <PWAInstallIcon onInstallClick={showPopup} />
              
              <ElegantLanguageSwitcher />
              <Link to="/profile" className={`p-2 ${isActive('/profile') ? 'text-sage-600' : 'text-gray-600'} hover:text-sage-500 transition-colors`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-xs bg-sage-100 text-sage-600">
                    {user?.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : getInitials(user?.email || 'U')}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="flex justify-around items-center py-3 md:hidden min-h-[60px]">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Tooltip key={path}>
                <TooltipTrigger asChild>
                  <Link
                    to={path}
                    className={`p-3 ${getIconColor(path)} hover:text-sage-500 transition-colors touch-manipulation active:scale-95`}
                  >
                    <Icon className={`${getIconSize(path)} transition-all duration-300`} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/profile"
                  className={`p-3 ${isActive('/profile') ? 'text-sage-600' : 'text-gray-600'} hover:text-sage-500 transition-colors touch-manipulation active:scale-95`}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-xs bg-sage-100 text-sage-600">
                      {user?.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : getInitials(user?.email || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('nav.profile') || 'Profile'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </nav>

      {/* PWA Install Popup */}
      <PWAInstallPrompt
        isVisible={isPopupVisible}
        isInstalling={isInstalling}
        showManualInstructions={showManualInstructions}
        onInstall={handleInstall}
        onDismiss={hidePopup}
      />
    </>
  );
};

export default Navigation;
