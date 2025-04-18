import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AnalysisStatus } from '@/lib/types';

interface InputSectionProps {
  narrationChain: string;
  mergeChain: string;
  onNarrationChainChange: (value: string) => void;
  onMergeChainChange: (value: string) => void;
  onAnalyze: () => void;
  onMerge: () => void;
  analysisStatus: AnalysisStatus;
  isAnalysisComplete: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  narrationChain,
  mergeChain,
  onNarrationChainChange,
  onMergeChainChange,
  onAnalyze,
  onMerge,
  analysisStatus,
  isAnalysisComplete
}) => {
  const isLoading = analysisStatus === 'loading';
  
  return (
    <div className="mb-8">
      <Card className="bg-card text-card-foreground">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">إدخال سلسلة الإسناد</h2>
          
          <div className="mb-4">
            <label htmlFor="narrationChain" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              سلسلة الإسناد
            </label>
            <Textarea 
              id="narrationChain" 
              rows={4} 
              dir="rtl"
              className="block w-full p-3 rtl-text text-lg bg-background border border-input rounded-lg focus:ring-primary focus:border-primary"
              placeholder="مثال: مالك عن نافع عن ابن عمر"
              value={narrationChain}
              onChange={(e) => onNarrationChainChange(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button 
                onClick={onAnalyze}
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                disabled={isLoading}
              >
                {isLoading ? 'جاري التحليل...' : 'تحليل'}
              </Button>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold mb-3">دمج سلسلة جديدة</h3>
            <label htmlFor="mergeChain" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              سلسلة الإسناد الثانية
            </label>
            <Textarea 
              id="mergeChain" 
              rows={3} 
              dir="rtl"
              className="block w-full p-3 rtl-text text-lg bg-background border border-input rounded-lg focus:ring-secondary focus:border-secondary"
              placeholder="مثال: مالك عن سالم عن ابن عمر"
              value={mergeChain}
              onChange={(e) => onMergeChainChange(e.target.value)}
              disabled={!isAnalysisComplete}
            />
            <div className="flex justify-end mt-2">
              <Button 
                onClick={onMerge}
                className="px-5 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                disabled={!isAnalysisComplete || isLoading}
              >
                دمج
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InputSection;
