import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HadithChain, AnalysisStatus } from '@/lib/types';

interface ApiResponseProps {
  analysisResult: HadithChain | null;
  status: AnalysisStatus;
}

const ApiResponse: React.FC<ApiResponseProps> = ({ analysisResult, status }) => {
  return (
    <Card className="bg-card text-card-foreground">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">نتائج التحليل</h2>
          <div className="flex items-center space-x-2">
            <span 
              className={`inline-flex h-3 w-3 rounded-full ${
                status === 'idle' ? 'bg-gray-300 dark:bg-gray-600' :
                status === 'loading' ? 'bg-blue-500' :
                status === 'success' ? 'bg-green-500' :
                'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
              {status === 'idle' ? 'لم يتم التحليل بعد' :
               status === 'loading' ? 'جاري التحليل...' :
               status === 'success' ? 'تم التحليل بنجاح' :
               'حدث خطأ أثناء التحليل'}
            </span>
          </div>
        </div>
        
        {analysisResult ? (
          <div className="border border-border rounded-lg p-4 bg-background rtl-text font-mono text-sm h-48 overflow-y-auto">
            <pre dir="ltr" className="text-xs md:text-sm">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">لا توجد بيانات لعرضها</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiResponse;
