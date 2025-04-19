import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HadithChain, AnalysisStatus } from '@/lib/types';

interface ApiResponseProps {
  analysisResult: HadithChain | null;
  status: AnalysisStatus;
}

const ApiResponse: React.FC<ApiResponseProps> = ({ analysisResult, status }) => {
  if (!analysisResult) return null;
  
  return (
    <div className="mt-6">
      <Card className="bg-card text-card-foreground">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 text-center">AI Response JSON</h2>
          
          <div className="border border-border rounded-lg p-4 bg-gray-100 dark:bg-gray-800 font-mono text-sm overflow-y-auto max-h-80">
            <pre dir="ltr" className="text-xs md:text-sm">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </div>
          
          <div className="mt-4 flex justify-end">
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
                {status === 'idle' ? 'Not analyzed yet' :
                status === 'loading' ? 'Processing...' :
                status === 'success' ? 'Analysis complete' :
                'Analysis failed'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiResponse;
