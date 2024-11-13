import { toast } from "sonner";
import { AUTH_CONFIG } from "@/config/auth";

export const registerBiometricCredential = async (email: string) => {
  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array(32),
        rp: {
          name: AUTH_CONFIG.APP_NAME,
          id: AUTH_CONFIG.APP_DOMAIN,
        },
        user: {
          id: new Uint8Array(16),
          name: email,
          displayName: email.split('@')[0],
        },
        pubKeyCredParams: [{
          type: "public-key",
          alg: -7
        }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "required",
        },
        timeout: 60000,
      }
    });

    if (credential) {
      toast.success("Fingerprint registered successfully!");
      return true;
    }
  } catch (error) {
    console.error("Error registering biometric credential:", error);
    toast.error("Failed to register fingerprint. You can try again later.");
    return false;
  }
};

export const authenticateWithBiometric = async () => {
  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array(32),
        rpId: AUTH_CONFIG.APP_DOMAIN,
        userVerification: "required",
        timeout: 60000,
      }
    });
    return assertion;
  } catch (error) {
    console.error("Biometric authentication error:", error);
    throw new Error("Biometric authentication failed");
  }
};