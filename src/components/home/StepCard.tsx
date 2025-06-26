
import React, { forwardRef } from 'react';
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StepCardProps {
  stepNumber: number;
  icon: LucideIcon;
  children: React.ReactNode;
  isRTL: boolean;
  numberRef?: React.Ref<HTMLDivElement>;
}

const StepCard = forwardRef<HTMLDivElement, StepCardProps>(
  ({ stepNumber, icon: Icon, children, isRTL, numberRef }, ref) => {
    return (
      <div className="relative h-full" ref={ref}>
        <div 
          ref={numberRef}
          className={`absolute ${isRTL ? '-right-6' : '-left-6'} top-8 flex items-center justify-center w-12 h-12 bg-sage-500 text-white rounded-full font-bold shadow-lg transform transition-transform hover:scale-110 z-10 text-lg`}
        >
          {stepNumber}
        </div>
        <Card className={`card-content h-full ${isRTL ? 'mr-8' : 'ml-8'} bg-white/90 backdrop-blur-sm border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300`}>
          <div className="p-6 sm:p-8 h-full">
            <div className="flex items-start gap-4 h-full">
              <div className="bg-sage-100 p-3 rounded-lg shadow-inner transform transition-transform hover:scale-105 flex-shrink-0">
                <Icon className="h-6 w-6 text-sage-600" />
              </div>
              <div className="flex-1 min-w-0">
                {children}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
);

StepCard.displayName = "StepCard";

export default StepCard;
