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
    <Card className="bg-card text-card-foreground">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Hadith Chain Builder</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-right">Parse Chain with AI</h3>
          <Textarea 
            id="narrationChain" 
            rows={3} 
            dir="rtl"
            className="block w-full p-3 rtl-text text-lg bg-background border border-input rounded-lg focus:ring-primary focus:border-primary"
            placeholder="مالك سمعت نافع عن ابن عمر"
            value={narrationChain}
            onChange={(e) => onNarrationChainChange(e.target.value)}
          />
          <div className="flex justify-center mt-4">
            <Button 
              onClick={onAnalyze}
              className="w-full py-2.5 bg-primary text-white hover:bg-primary/90 rounded-md font-medium transition-colors focus:outline-none"
              disabled={isLoading}
              variant="default"
            >
              Parse Chain with AI
            </Button>
          </div>
          
          {isAnalysisComplete && (
            <div className="mt-4 text-right text-sm text-purple-600">
              يرجى التأكد من تحليل السلسلة: ملاحظة! تأكد السلسلة من الجهة اليمين إلى اليسار
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold mb-2 text-right">Merge Chains</h3>
          <Textarea 
            id="mergeChain" 
            rows={3} 
            dir="rtl"
            className="block w-full p-3 rtl-text text-lg bg-background border border-input rounded-lg focus:ring-secondary focus:border-secondary"
            placeholder="أحمد عن قتادة عن أنس"
            value={mergeChain}
            onChange={(e) => onMergeChainChange(e.target.value)}
            disabled={!isAnalysisComplete}
          />
          <div className="flex justify-center mt-4">
            <Button 
              onClick={onMerge}
              className="w-full bg-slate-800 text-white hover:bg-slate-700 rounded-md font-medium transition-colors focus:outline-none"
              disabled={!isAnalysisComplete || isLoading}
              variant="default"
            >
              Update Hadith
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button 
            onClick={() => {
              onNarrationChainChange('');
              onMergeChainChange('');
            }}
            className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md font-medium transition-colors focus:outline-none"
            variant="outline"
          >
            Clear Chain
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputSection;
