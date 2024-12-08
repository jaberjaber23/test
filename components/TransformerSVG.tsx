import React from 'react';
import { motion } from 'framer-motion';

interface ComponentData {
  color: string;
  name: string;
  description: string;
  mathNotation: string;
}

interface TransformerSVGProps {
  components: Record<string, ComponentData>;
  selectedComponent: string | null;
  setSelectedComponent: (component: string | null) => void;
}

const TransformerSVG: React.FC<TransformerSVGProps> = ({ components, selectedComponent, setSelectedComponent }) => {
  const renderComponent = (
    x: number,
    y: number,
    width: number,
    height: number,
    component: string,
    label: string,
    mathNotation: string
  ) => (
    <g key={component}>
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={components[component]?.color || "#f0f0f0"}
        stroke={selectedComponent === component ? "#000" : "#666"}
        strokeWidth="1.5"
        rx="5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setSelectedComponent(component)}
      />
      <text x={x + width / 2} y={y + height / 2 - 8} textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="bold">
        {label}
      </text>
      <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fontSize="12" fontStyle="italic">
        {mathNotation}
      </text>
    </g>
  );

  const renderArrow = (startX: number, startY: number, endX: number, endY: number, label?: string, isMainFlow: boolean = false) => (
    <g>
      <motion.line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={isMainFlow ? "#000" : "#666"}
        strokeWidth={isMainFlow ? "2" : "1.5"}
        markerEnd={isMainFlow ? "url(#arrowhead-black)" : "url(#arrowhead)"}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      {label && (
        <text x={(startX + endX) / 2} y={(startY + endY) / 2 - 5} textAnchor="middle" fontSize="12" fill="#666">
          {label}
        </text>
      )}
    </g>
  );

  const renderConnectingLine = (component: string, x: number, y: number) => (
    <motion.line
      x1={750}
      y1={y}
      x2={800}
      y2={y}
      stroke={selectedComponent === component ? "#000" : "#666"}
      strokeWidth="1.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
    />
  );

  return (
    <svg viewBox="0 0 800 760" className="w-full h-full">
            <rect width="800" height="760" fill="white" />
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
        </marker>
        <marker id="arrowhead-black" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
        </marker>
      </defs>

      <text x="400" y="30" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#333">Transformer Architecture</text>

      {renderComponent(50, 60, 700, 50, 'input', 'Input Sequence', 'X = (x₁, ..., xₙ) ∈ ℝ^(n×d_model)')}
      {renderComponent(100, 130, 600, 50, 'positional', 'Positional Encoding', 'PE(pos,2i) = sin(pos/10000^(2i/d_model))')}

      <rect x="50" y="200" width="700" height="400" fill="none" stroke="#666" strokeWidth="2" strokeDasharray="5,5" rx="10" />
      <text x="70" y="230" fontSize="18" fontWeight="bold" fill="#333">Encoder Stack (×N)</text>

      {renderComponent(100, 250, 600, 70, 'attention', 'Multi-Head Attention', 'Attention(Q,K,V) = softmax(QK^T/√d_k)V')}
      {renderComponent(100, 340, 600, 50, 'norm', 'Add & Norm', 'LayerNorm(x + MultiHeadAttention(x))')}
      {renderComponent(100, 410, 600, 70, 'ffn', 'Feed Forward Network', 'FFN(x) = max(0, xW₁ + b₁)W₂ + b₂')}
      {renderComponent(100, 500, 600, 50, 'norm', 'Add & Norm', 'LayerNorm(x + FFN(x))')}

      {renderComponent(50, 620, 700, 50, 'output', 'Output Linear & Softmax', 'P(y|x) = softmax(xW_o + b_o)')}

      {/* Main flow arrows */}
      {renderArrow(400, 110, 400, 130, undefined, true)}
      {renderArrow(400, 180, 400, 250, undefined, true)}
      {renderArrow(400, 320, 400, 340, undefined, true)}
      {renderArrow(400, 390, 400, 410, undefined, true)}
      {renderArrow(400, 480, 400, 500, undefined, true)}
      {renderArrow(400, 550, 400, 620, undefined, true)}

      {/* Residual connections */}
      <motion.path
        d="M 720 285 C 750 285, 750 365, 720 365"
        fill="none"
        stroke="#666"
        strokeWidth="1.5"
        strokeDasharray="5,5"
        markerEnd="url(#arrowhead)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 1 }}
      />
      <motion.path
        d="M 720 445 C 750 445, 750 525, 720 525"
        fill="none"
        stroke="#666"
        strokeWidth="1.5"
        strokeDasharray="5,5"
        markerEnd="url(#arrowhead)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      />

      <text x="760" y="325" textAnchor="middle" fontSize="12" fill="#666" transform="rotate(90 760 325)">Residual</text>
      <text x="760" y="485" textAnchor="middle" fontSize="12" fill="#666" transform="rotate(90 760 485)">Residual</text>

      {renderConnectingLine('input', 750, 85)}
      {renderConnectingLine('positional', 750, 155)}
      {renderConnectingLine('attention', 750, 285)}
      {renderConnectingLine('norm', 750, 365)}
      {renderConnectingLine('ffn', 750, 445)}
      {renderConnectingLine('output', 750, 645)}
    </svg>
  );
};

export default TransformerSVG;