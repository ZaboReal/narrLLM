import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InputSection from '@/components/InputSection';
import GraphVisualization from '@/components/GraphVisualization';
import ApiResponse from '@/components/ApiResponse';
import { useToast } from '@/hooks/use-toast';
import { analyzeNarrationChain, mergeNarrationChains } from '@/lib/geminiApi';
import { HadithChain, AnalysisStatus } from '@/lib/types';

const Home: React.FC = () => {
  const { toast } = useToast();
  const [narrationChain, setNarrationChain] = React.useState<string>('');
  const [mergeChain, setMergeChain] = React.useState<string>('');
  const [analysisStatus, setAnalysisStatus] = React.useState<AnalysisStatus>('idle');
  const [analysisResult, setAnalysisResult] = React.useState<HadithChain | null>(null);
  const [isGraphVisible, setIsGraphVisible] = React.useState<boolean>(false);

  const handleAnalyze = async () => {
    if (!narrationChain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a narration chain",
        variant: "destructive",
      });
      return;
    }

    setAnalysisStatus('loading');
    
    try {
      const result = await analyzeNarrationChain(narrationChain);
      setAnalysisResult(result);
      setIsGraphVisible(true);
      setAnalysisStatus('success');
      
      toast({
        title: "Analysis Complete",
        description: "The narration chain has been analyzed successfully",
      });
    } catch (error) {
      console.error('Error analyzing narration chain:', error);
      setAnalysisStatus('error');
      
      toast({
        title: "Analysis Error",
        description: "An error occurred while analyzing the narration chain",
        variant: "destructive",
      });
    }
  };

  const handleMerge = async () => {
    if (!mergeChain.trim() || !analysisResult) {
      toast({
        title: "Error",
        description: "Please enter a second narration chain",
        variant: "destructive",
      });
      return;
    }

    setAnalysisStatus('loading');
    
    try {
      const result = await mergeNarrationChains(narrationChain, mergeChain);
      setAnalysisResult(result);
      setAnalysisStatus('success');
      
      toast({
        title: "Merge Complete",
        description: "The narration chains have been merged successfully",
      });
    } catch (error) {
      console.error('Error merging chains:', error);
      setAnalysisStatus('error');
      
      toast({
        title: "Merge Error",
        description: "An error occurred while merging the narration chains",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-6">
            <InputSection 
              narrationChain={narrationChain}
              mergeChain={mergeChain}
              onNarrationChainChange={setNarrationChain}
              onMergeChainChange={setMergeChain}
              onAnalyze={handleAnalyze}
              onMerge={handleMerge}
              analysisStatus={analysisStatus}
              isAnalysisComplete={!!analysisResult}
            />
            
            <ApiResponse 
              analysisResult={analysisResult}
              status={analysisStatus}
            />
          </div>
          
          <div className="h-full">
            {isGraphVisible && (
              <GraphVisualization 
                hadithChain={analysisResult}
                isVisible={isGraphVisible}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
