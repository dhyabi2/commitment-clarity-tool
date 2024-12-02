import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from '@/lib/i18n/LanguageContext';

const Auth = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-sage-600 mb-8 text-center">
          {t('auth.welcome')}
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#84a98c',
                    brandAccent: '#52796f',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;