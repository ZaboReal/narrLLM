import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  NodeChange,
  ReactFlowInstance,
  applyNodeChanges,
} from 'reactflow';
import { MarkerType } from 'reactflow';
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
    if (hadithChain) {
      // Check if we have a structure - if not, create a simple linear structure from the narrators
      if (!hadithChain.structure && hadithChain.narrators && hadithChain.narrators.length > 0) {
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

        // Create linear edges between narrators
        const newEdges: Edge[] = [];
        for (let i = 0; i < hadithChain.narrators.length - 1; i++) {
          const transmissionType = hadithChain.transmissions && hadithChain.transmissions[i] 
            ? hadithChain.transmissions[i] 
            : "عن";
          
          newEdges.push({
            id: `e${i}`,
            source: hadithChain.narrators[i],
            target: hadithChain.narrators[i + 1],
            type: 'default',
            label: transmissionType,
            labelStyle: { fontFamily: '"Noto Sans Arabic", sans-serif', fill: '#6366f1' },
            style: { stroke: '#6366f1', strokeWidth: 2 },
            markerEnd: { type: MarkerType.Arrow }, // Using Arrow but it won't be shown
          });
        }

        setNodes(newNodes);
        setEdges(newEdges);
      } 
      // If we have a structure, use it
      else if (hadithChain.structure) {
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
          markerEnd: { type: MarkerType.Arrow }, // Using Arrow but it won't be shown
        }));

        setNodes(newNodes);
        setEdges(newEdges);
      }
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

  if (!isVisible) return null;

  return (
    <div className="mt-6">
      <Card className="bg-card text-card-foreground">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 text-center">Chain Visualization</h2>
          
          {(!hadithChain || (!hadithChain.narrators || hadithChain.narrators.length === 0)) ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500">Add narrators to visualize the chain</p>
            </div>
          ) : (
            <div className="h-[300px] border border-border rounded-lg bg-background" style={{ direction: 'ltr' }}>
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
                    type: MarkerType.Arrow,
                  },
                  style: { strokeWidth: 2, stroke: '#6366f1' }
                }}
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphVisualization;
