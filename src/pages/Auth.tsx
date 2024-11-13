import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint, Mail } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  useEffect(() => {
    // Check if biometrics is available
    const checkBiometricAvailability = async () => {
      if (!window.PublicKeyCredential) {
        console.log("WebAuthn is not supported by this browser");
        return;
      }

      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setBiometricsAvailable(available);
      } catch (error) {
        console.error("Error checking biometric availability:", error);
      }
    };

    checkBiometricAvailability();

    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
        toast.success("Successfully signed in!");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      
      toast.success("Check your email for the login link!");
    } catch (error) {
      toast.error("Error sending magic link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricSignIn = async () => {
    setIsLoading(true);
    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session exists, we need to create a new credential
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: {
              name: "Your App Name",
              id: window.location.hostname,
            },
            user: {
              id: new Uint8Array(16),
              name: email || "user@example.com",
              displayName: "User",
            },
            pubKeyCredParams: [{
              type: "public-key",
              alg: -7
            }],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required",
            },
            timeout: 60000,
          }
        });

        if (credential) {
          // Use magic link as fallback after biometric authentication
          await handleEmailSignIn(new Event('submit'));
        }
      } else {
        // If session exists, we can get the credential
        const assertion = await navigator.credentials.get({
          publicKey: {
            challenge: new Uint8Array(32),
            rpId: window.location.hostname,
            userVerification: "required",
            timeout: 60000,
          }
        });

        if (assertion) {
          toast.success("Biometric authentication successful!");
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      toast.error("Biometric authentication failed. Please try email sign-in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Fingerprint className="h-6 w-6 text-sage-600" />
            Sign in securely
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-sage-600" />
                <span className="text-sm font-medium">Email Sign In</span>
              </div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-sage-600 hover:bg-sage-700"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Magic Link"}
            </Button>
          </form>

          {biometricsAvailable && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleBiometricSignIn}
                disabled={isLoading}
              >
                <Fingerprint className="mr-2 h-4 w-4" />
                Sign in with Fingerprint
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;