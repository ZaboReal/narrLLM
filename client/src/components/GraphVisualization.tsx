import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  NodeChange,
  ReactFlowInstance,
  applyNodeChanges,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent } from '@/components/ui/card';
import { HadithChain } from '@/lib/types';

interface GraphVisualizationProps {
  hadithChain: HadithChain | null;
  isVisible: boolean;
}

// Layout for top to bottom tree
const calculateNodePositions = (narrators: string[]): { [key: string]: { x: number, y: number } } => {
  const positions: { [key: string]: { x: number, y: number } } = {};
  
  narrators.forEach((narrator, index) => {
    positions[narrator] = {
      x: (index % 3) * 180,  // Arrange in 3 columns at most
      y: Math.floor(index / 3) * 120  // New row every 3 narrators
    };
  });
  
  return positions;
};

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ hadithChain, isVisible }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  React.useEffect(() => {
    if (hadithChain) {
      // Check if we have a structure - if not, create a simple linear structure from the narrators
      if (!hadithChain.structure && hadithChain.narrators && hadithChain.narrators.length > 0) {
        // Calculate positions for a top to bottom tree layout
        const nodePositions = calculateNodePositions(hadithChain.narrators);
        
        // Create nodes from narrators
        const newNodes: Node[] = hadithChain.narrators.map((narrator) => ({
          id: narrator,
          data: { label: narrator },
          position: { x: nodePositions[narrator].x, y: nodePositions[narrator].y },
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #000',
            borderRadius: '8px',
            padding: '10px',
            fontWeight: 'bold',
            width: 150,
            textAlign: 'center',
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
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
            type: 'smoothstep',
            label: transmissionType,
            labelStyle: { fontFamily: '"Noto Sans Arabic", sans-serif', fill: '#000' },
            style: { stroke: '#000', strokeWidth: 1.5, strokeDasharray: '5,5' },
          });
        }

        setNodes(newNodes);
        setEdges(newEdges);
      } 
      // If we have a structure, use it
      else if (hadithChain.structure) {
        // Calculate positions for nodes
        const nodePositions = calculateNodePositions(hadithChain.narrators);
        
        // Create nodes from narrators
        const newNodes: Node[] = hadithChain.narrators.map((narrator) => ({
          id: narrator,
          data: { label: narrator },
          position: { x: nodePositions[narrator].x, y: nodePositions[narrator].y },
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #000',
            borderRadius: '8px',
            padding: '10px',
            fontWeight: 'bold',
            width: 150,
            textAlign: 'center',
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        }));

        // Create edges from connections
        const newEdges: Edge[] = hadithChain.structure.connections.map((connection, index) => ({
          id: `e${index}`,
          source: connection.from,
          target: connection.to,
          type: 'smoothstep',
          label: connection.type,
          labelStyle: { fontFamily: '"Noto Sans Arabic", sans-serif', fill: '#000' },
          style: { stroke: '#000', strokeWidth: 1.5, strokeDasharray: '5,5' },
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
    <Card className="bg-white text-card-foreground h-full">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-2 text-center">Chain Visualization</h2>
        
        {(!hadithChain || (!hadithChain.narrators || hadithChain.narrators.length === 0)) ? (
          <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg">
            <p className="text-gray-500">Add narrators to visualize the chain</p>
          </div>
        ) : (
          <div className="h-[500px] border border-gray-200 rounded-lg bg-white" style={{ direction: 'ltr' }}>
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
                style: { strokeWidth: 1.5, stroke: '#000', strokeDasharray: '5,5' }
              }}
            >
              <Background gap={15} size={1} color="#000" />
              <Controls />
            </ReactFlow>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GraphVisualization;
