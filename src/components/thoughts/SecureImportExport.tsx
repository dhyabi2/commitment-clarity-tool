
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, Shield } from "lucide-react";
import { useSecureImportExport } from '@/hooks/useSecureImportExport';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export const SecureImportExport = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { exportData, importData, isExporting, isImporting } = useSecureImportExport();

  if (!user) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-yellow-700">
            <Shield className="h-4 w-4" />
            <span>Please sign in to access import/export features.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Security: Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File too large. Maximum size is 10MB.');
        return;
      }

      // Security: Validate file type
      const allowedTypes = ['application/json', 'text/xml', 'application/xml'];
      const allowedExtensions = ['.json', '.xml'];
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
        alert('Invalid file type. Please select a JSON or XML file.');
        return;
      }

      importData(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t('import.secureTitle') || 'Secure Data Management'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            <strong>Security Notice:</strong> All imports are automatically filtered to your account. 
            Only you can access your exported data.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => exportData()}
            disabled={isExporting}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : (t('import.export') || 'Export My Data')}
          </Button>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            variant="outline"
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? 'Importing...' : (t('import.import') || 'Import Data')}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.xml"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Supported formats: JSON, XML</p>
          <p>• Maximum file size: 10MB</p>
          <p>• Data is automatically secured to your account</p>
        </div>
      </CardContent>
    </Card>
  );
};
