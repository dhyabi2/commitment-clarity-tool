
// Extend Navigator interface to include iOS-specific properties
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}
