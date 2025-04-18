import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MarkerType,
  Node,
  NodeChange,
  ReactFlowInstance,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent } from '@/components/ui/card';
import { HadithChain } from '@/lib/types';

interface GraphVisualizationProps {
  hadithChain: HadithChain | null;
  isVisible: boolean;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ hadithChain, isVisible }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  React.useEffect(() => {
    if (hadithChain && hadithChain.structure) {
      // Create nodes from narrators
      const newNodes: Node[] = hadithChain.narrators.map((narrator, index) => ({
        id: narrator,
        data: { label: narrator },
        position: { x: index * 200, y: 100 },
        style: {
          background: 'white',
          color: '#1f2937',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '10px',
          fontWeight: 'bold',
          width: 120,
          textAlign: 'center',
        },
      }));

      // Create edges from connections
      const newEdges: Edge[] = hadithChain.structure.connections.map((connection, index) => ({
        id: `e${index}`,
        source: connection.from,
        target: connection.to,
        type: 'default',
        label: connection.type,
        labelStyle: { fontFamily: '"Noto Sans Arabic", sans-serif', fill: '#6366f1' },
        style: { stroke: '#6366f1', strokeWidth: 2 },
        markerEnd: { type: MarkerType.None },
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [hadithChain]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
    setTimeout(() => {
      instance.fitView({ padding: 0.2 });
    }, 100);
  }, []);

  return (
    <Card className="bg-card text-card-foreground mb-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">رسم بياني للإسناد</h2>
        
        {!isVisible ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mb-1">لا يوجد بيانات للعرض</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">قم بإدخال سلسلة الإسناد والضغط على زر التحليل</p>
          </div>
        ) : (
          <div className="h-[500px] border border-border rounded-lg bg-background" style={{ direction: 'ltr' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onInit={onInit}
              fitView
              attributionPosition="bottom-right"
              minZoom={0.2}
              maxZoom={4}
              defaultEdgeOptions={{
                markerEnd: {
                  type: MarkerType.None,
                },
              }}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GraphVisualization;
