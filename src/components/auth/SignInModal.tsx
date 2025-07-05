
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Chrome, Loader2, UserX } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

const SignInModal: React.FC<SignInModalProps> = ({ 
  open, 
  onOpenChange, 
  title,
  description
}) => {
  const { signInWithGoogle, user } = useAuth();
  const { t } = useLanguage();
  const { isAnonymous, enableAnonymousMode } = useAnonymousMode();
  const [isLoading, setIsLoading] = React.useState(false);

  const modalTitle = title || t('auth.signInRequired');
  const modalDescription = description || t('auth.signInDescription');

  // Don't show modal if user is authenticated or already in anonymous mode
  if (user || isAnonymous) {
    return null;
  }

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // Modal will close automatically when auth state changes
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  const handleAnonymousAccess = () => {
    enableAnonymousMode();
    onOpenChange(false);
    // Navigate to thoughts page
    window.location.href = '/thoughts';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{modalTitle}</DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {modalDescription}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 pt-4">
          <Button 
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-sage-600 hover:bg-sage-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Chrome className="w-4 h-4 mr-2" />
            )}
            {t('auth.signInWithGoogle')}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">{t('auth.or')}</span>
            </div>
          </div>

          <Button 
            onClick={handleAnonymousAccess}
            variant="outline"
            className="w-full"
          >
            <UserX className="w-4 h-4 mr-2" />
            {t('auth.continueAnonymously')}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            {t('auth.maybeOrLater')}
          </Button>
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          {t('auth.anonymousNote')}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
