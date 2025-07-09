import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Trash2, Copy } from 'lucide-react';

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'log' | 'error' | 'warn' | 'info';
  message: string;
  args?: any[];
}

interface MobileConsoleProps {
  isVisible: boolean;
  onClose: () => void;
}

const MobileConsole = ({ isVisible, onClose }: MobileConsoleProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isCapturing, setIsCapturing] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logIdRef = useRef(0);

  useEffect(() => {
    if (!isCapturing) return;

    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    };

    const createLogEntry = (level: LogEntry['level'], args: any[]): LogEntry => ({
      id: logIdRef.current++,
      timestamp: new Date().toLocaleTimeString(),
      level,
      message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '),
      args
    });

    const interceptConsole = (level: LogEntry['level'], originalMethod: any) => {
      return (...args: any[]) => {
        originalMethod.apply(console, args);
        
        // Only capture PWA related logs or errors
        const message = args.join(' ');
        if (message.includes('PWA') || 
            message.includes('install') || 
            message.includes('Service Worker') ||
            message.includes('SW') ||
            message.includes('beforeinstallprompt') ||
            message.includes('appinstalled') ||
            level === 'error') {
          
          setLogs(prev => {
            const newLogs = [...prev, createLogEntry(level, args)];
            return newLogs.slice(-50); // Keep last 50 logs
          });
        }
      };
    };

    console.log = interceptConsole('log', originalConsole.log);
    console.error = interceptConsole('error', originalConsole.error);
    console.warn = interceptConsole('warn', originalConsole.warn);
    console.info = interceptConsole('info', originalConsole.info);

    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
    };
  }, [isCapturing]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
  };

  const copyLogs = () => {
    const logsText = logs.map(log => `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`).join('\n');
    navigator.clipboard.writeText(logsText);
  };

  const getLogColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-600';
      case 'warn': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-700';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-lg h-96 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Mobile Console</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCapturing(!isCapturing)}
              className={isCapturing ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
            >
              {isCapturing ? 'Recording' : 'Paused'}
            </Button>
            <Button variant="ghost" size="sm" onClick={copyLogs}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={clearLogs}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No logs yet. Try installing the PWA to see logs here.
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="mb-2">
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                  <span className={`font-semibold ${getLogColor(log.level)}`}>
                    {log.level.toUpperCase()}:
                  </span>
                </div>
                <div className="pl-4 whitespace-pre-wrap break-all">
                  {log.message}
                </div>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
        
        <div className="p-2 border-t bg-gray-100 text-xs text-gray-600">
          Showing PWA, installation, and error logs only
        </div>
      </Card>
    </div>
  );
};

export default MobileConsole;