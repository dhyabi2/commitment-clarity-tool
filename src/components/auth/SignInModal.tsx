
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Chrome, Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

const SignInModal: React.FC<SignInModalProps> = ({ 
  open, 
  onOpenChange, 
  title = "Sign in required",
  description = "Please sign in to use this feature and save your data securely."
}) => {
  const { signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = React.useState(false);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {description}
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
            Continue with Google
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Maybe later
          </Button>
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          Your thoughts and commitments will be securely saved to your account.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
