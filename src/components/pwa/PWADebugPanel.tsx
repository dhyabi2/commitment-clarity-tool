import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface PWADebugPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const PWADebugPanel = ({ isVisible, onClose }: PWADebugPanelProps) => {
  const { isInstallable, isInstalled, deferredPrompt } = usePWAInstall();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    if (isVisible) {
      const updateDebugInfo = () => {
        const info = {
          // Device info
          userAgent: navigator.userAgent,
          isAndroid: /Android/.test(navigator.userAgent),
          isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
          isInStandaloneMode: window.navigator.standalone,
          displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser',
          
          // PWA capabilities
          serviceWorkerSupported: 'serviceWorker' in navigator,
          manifestSupported: 'manifest' in document.createElement('link'),
          beforeInstallPromptSupported: 'BeforeInstallPromptEvent' in window,
          
          // Install state
          isInstallable,
          isInstalled,
          hasDeferredPrompt: deferredPrompt,
          
          // Environment
          isDev: import.meta.env.DEV,
          currentURL: window.location.href,
          
          // PWA requirements check
          hasManifest: !!document.querySelector('link[rel="manifest"]'),
          hasServiceWorker: false,
          hasIcons: !!document.querySelector('link[rel="apple-touch-icon"]'),
          isHttps: location.protocol === 'https:' || location.hostname === 'localhost',
        };

        // Check service worker registration
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            setDebugInfo(prev => ({
              ...prev,
              hasServiceWorker: registrations.length > 0,
              swRegistrations: registrations.length
            }));
          });
        }

        setDebugInfo(info);
      };

      updateDebugInfo();
      const interval = setInterval(updateDebugInfo, 2000);
      return () => clearInterval(interval);
    }
  }, [isVisible, isInstallable, isInstalled, deferredPrompt]);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: boolean, text: string) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className="ml-2">
        {text}
      </Badge>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">PWA Debug Panel</h2>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>

          <div className="space-y-4">
            {/* Device Info */}
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Device Information
              </h3>
              <div className="space-y-1 text-sm">
                <div>Platform: {debugInfo.isAndroid ? 'Android' : debugInfo.isIOS ? 'iOS' : 'Desktop'}</div>
                <div>Display Mode: {debugInfo.displayMode}</div>
                <div>Standalone: {debugInfo.isInStandaloneMode ? 'Yes' : 'No'}</div>
                <div>Environment: {debugInfo.isDev ? 'Development' : 'Production'}</div>
              </div>
            </div>

            {/* PWA Requirements */}
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                PWA Requirements
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.isHttps)}
                  <span className="text-sm">HTTPS Connection</span>
                  {getStatusBadge(debugInfo.isHttps, debugInfo.isHttps ? 'Pass' : 'Fail')}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.hasManifest)}
                  <span className="text-sm">Web App Manifest</span>
                  {getStatusBadge(debugInfo.hasManifest, debugInfo.hasManifest ? 'Pass' : 'Fail')}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.hasServiceWorker)}
                  <span className="text-sm">Service Worker</span>
                  {getStatusBadge(debugInfo.hasServiceWorker, debugInfo.hasServiceWorker ? 'Pass' : 'Fail')}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.hasIcons)}
                  <span className="text-sm">App Icons</span>
                  {getStatusBadge(debugInfo.hasIcons, debugInfo.hasIcons ? 'Pass' : 'Fail')}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.serviceWorkerSupported)}
                  <span className="text-sm">Service Worker Support</span>
                  {getStatusBadge(debugInfo.serviceWorkerSupported, debugInfo.serviceWorkerSupported ? 'Pass' : 'Fail')}
                </div>
              </div>
            </div>

            {/* Install State */}
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Installation State
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.isInstallable)}
                  <span className="text-sm">Installable</span>
                  {getStatusBadge(debugInfo.isInstallable, debugInfo.isInstallable ? 'Yes' : 'No')}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.isInstalled)}
                  <span className="text-sm">Installed</span>
                  {getStatusBadge(debugInfo.isInstalled, debugInfo.isInstalled ? 'Yes' : 'No')}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.hasDeferredPrompt)}
                  <span className="text-sm">Install Prompt Available</span>
                  {getStatusBadge(debugInfo.hasDeferredPrompt, debugInfo.hasDeferredPrompt ? 'Yes' : 'No')}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="font-medium mb-2">Recommendations</h3>
              <div className="text-sm space-y-1">
                {!debugInfo.isHttps && (
                  <div className="text-red-600">• HTTPS is required for PWA installation</div>
                )}
                {!debugInfo.hasServiceWorker && (
                  <div className="text-red-600">• Service Worker is required for PWA</div>
                )}
                {debugInfo.isIOS && !debugInfo.isInStandaloneMode && (
                  <div className="text-blue-600">• iOS requires manual installation via Safari share menu</div>
                )}
                {debugInfo.isAndroid && !debugInfo.hasDeferredPrompt && debugInfo.isDev && (
                  <div className="text-blue-600">• Android dev mode: Use Chrome menu &gt; "Install app"</div>
                )}
                {debugInfo.isInstallable && debugInfo.hasDeferredPrompt && (
                  <div className="text-green-600">• PWA is ready for installation!</div>
                )}
              </div>
            </div>

            {/* Debug Actions */}
            <div className="pt-4 border-t">
              <Button
                onClick={() => {
                  console.log('🔍 Full PWA Debug Info:', debugInfo);
                  if ((window as any).debugPWA) {
                    (window as any).debugPWA();
                  }
                }}
                variant="outline"
                className="w-full"
              >
                Log Full Debug Info to Console
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PWADebugPanel;