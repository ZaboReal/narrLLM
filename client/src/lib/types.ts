export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

export interface Connection {
  from: string;
  to: string;
  type: string;
}

export interface HadithStructure {
  root: string;
  connections: Connection[];
}

export interface HadithChain {
  narrators: string[];
  transmissionTypes: string[];
  structure: HadithStructure;
}

export interface AnalyzeRequestBody {
  narrationChain: string;
}

export interface MergeRequestBody {
  originalChain: string;
  newChain: string;
}
