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
        title: "خطأ",
        description: "الرجاء إدخال سلسلة الإسناد",
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
        title: "تم التحليل",
        description: "تم تحليل سلسلة الإسناد بنجاح",
      });
    } catch (error) {
      console.error('Error analyzing narration chain:', error);
      setAnalysisStatus('error');
      
      toast({
        title: "خطأ في التحليل",
        description: "حدث خطأ أثناء تحليل سلسلة الإسناد",
        variant: "destructive",
      });
    }
  };

  const handleMerge = async () => {
    if (!mergeChain.trim() || !analysisResult) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال سلسلة الإسناد الثانية",
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
        title: "تم الدمج",
        description: "تم دمج سلاسل الإسناد بنجاح",
      });
    } catch (error) {
      console.error('Error merging chains:', error);
      setAnalysisStatus('error');
      
      toast({
        title: "خطأ في الدمج",
        description: "حدث خطأ أثناء دمج سلاسل الإسناد",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
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
        
        <GraphVisualization 
          hadithChain={analysisResult}
          isVisible={isGraphVisible}
        />
        
        <ApiResponse 
          analysisResult={analysisResult}
          status={analysisStatus}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
