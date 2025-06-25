
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
      <div className="relative" ref={ref}>
        <div 
          ref={numberRef}
          className={`absolute ${isRTL ? '-right-4 sm:-right-8' : '-left-4 sm:-left-8'} top-6 flex items-center justify-center w-8 h-8 bg-sage-500 text-white rounded-full font-bold shadow-lg transform transition-transform hover:scale-110 z-10`}
        >
          {stepNumber}
        </div>
        <Card className={`card-content p-6 sm:p-8 ${isRTL ? 'mr-6 sm:mr-4' : 'ml-6 sm:ml-4'} bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300`}>
          <div className="space-y-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="bg-sage-100 p-1.5 sm:p-2 rounded-lg shadow-inner transform transition-transform hover:scale-105 flex-shrink-0">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-sage-600" />
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
