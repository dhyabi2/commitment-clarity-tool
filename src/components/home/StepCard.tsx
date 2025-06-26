
import React, { forwardRef } from 'react';
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StepCardProps {
  stepNumber: number;
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  isRTL: boolean;
}

const StepCard = forwardRef<HTMLDivElement, StepCardProps>(
  ({ stepNumber, icon: Icon, title, children, isRTL }, ref) => {
    return (
      <div className="relative w-full" ref={ref}>
        {/* Step Number Badge */}
        <div className={`absolute ${isRTL ? '-right-3' : '-left-3'} top-6 z-20`}>
          <div className="flex items-center justify-center w-12 h-12 bg-sage-500 text-white rounded-full font-bold text-lg shadow-lg border-4 border-white">
            {stepNumber}
          </div>
        </div>

        {/* Main Card */}
        <Card className={`w-full ${isRTL ? 'mr-6' : 'ml-6'} bg-white/95 backdrop-blur-sm border-sage-200 shadow-lg rounded-2xl overflow-hidden`}>
          {/* Card Header */}
          <div className="bg-gradient-to-r from-sage-50 to-sage-100 px-6 py-4 border-b border-sage-200">
            <div className="flex items-center gap-3">
              <div className="bg-sage-500 p-2.5 rounded-xl shadow-sm">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-sage-700 flex-1">
                {title}
              </h2>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {children}
          </div>
        </Card>
      </div>
    );
  }
);

StepCard.displayName = "StepCard";

export default StepCard;
