"use client"
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css'; // Import a CSS file for custom styles

const components = {
  input: {
    color: '#E6F3FF',
    name: 'Input Embedding',
    mathNotation: 'E(X) ∈ ℝ^(n×d_model)',
    description: 'Transforms input tokens into continuous vector representations. Each token is mapped to a d_model-dimensional vector.',
    formula: 'E(x_i) = W_e * x_i, where W_e ∈ ℝ^(d_model × vocab_size)',
    keyPoints: [
      'Converts discrete tokens to dense vectors',
      'Allows the model to process input in a continuous space',
      'Learned during training to capture semantic relationships'
    ]
  },
  positional: {
    color: '#FFE6E6',
    name: 'Positional Encoding',
    mathNotation: 'PE(pos,2i) = sin(pos/10000^(2i/d_model))',
    description: 'Adds information about the position of tokens in the sequence, allowing the model to utilize the order of the sequence.',
    formula: 'PE(pos,2i+1) = cos(pos/10000^(2i/d_model))',
    keyPoints: [
      'Injects sequence order information',
      'Uses sinusoidal functions for position representation',
      'Allows the model to attend to relative positions'
    ]
  },
  attention: {
    color: '#E6FFE6',
    name: 'Multi-Head Attention',
    mathNotation: 'Attention(Q,K,V) = softmax(QK^T/√d_k)V',
    description: 'Allows the model to jointly attend to information from different representation subspaces at different positions.',
    formula: 'MultiHead(Q,K,V) = Concat(head_1, ..., head_h)W^O',
    keyPoints: [
      'Captures contextual relationships between tokens',
      'Uses multiple attention heads for diverse representations',
      'Enables parallel computation for efficiency'
    ]
  },
  norm: {
    color: '#FFE6FF',
    name: 'Layer Normalization',
    mathNotation: 'LN(x) = α * (x - μ) / (σ + ε) + β',
    description: 'Normalizes the inputs to have zero mean and unit variance, stabilizing the learning process.',
    formula: 'μ = 1/n Σx_i, σ^2 = 1/n Σ(x_i - μ)^2',
    keyPoints: [
      'Stabilizes the learning process',
      'Allows for training of very deep networks',
      'Applied after each sub-layer in the encoder and decoder'
    ]
  },
  ffn: {
    color: '#FFFDE6',
    name: 'Feed-Forward Network',
    mathNotation: 'FFN(x) = max(0, xW_1 + b_1)W_2 + b_2',
    description: 'Applies non-linear transformations to each position separately and identically.',
    formula: 'ReLU(x) = max(0, x)',
    keyPoints: [
      'Introduces non-linearity to the model',
      'Processes each position independently',
      'Typically uses ReLU activation function'
    ]
  },
  output: {
    color: '#E6FFF9',
    name: 'Output Linear & Softmax',
    mathNotation: 'P(y|x) = softmax(xW_o + b_o)',
    description: 'Transforms the final hidden states into output probabilities over the vocabulary.',
    formula: 'softmax(x_i) = exp(x_i) / Σexp(x_j)',
    keyPoints: [
      'Projects hidden states onto output vocabulary',
      'Applies softmax to obtain probability distribution',
      'Used for final prediction or generation'
    ]
  },
};

const hierarchicalItems = [
  { name: 'Input Embedding', component: 'input' },
  { name: 'Positional Encoding', component: 'positional' },
  { 
    name: 'Encoder Stack',
    children: [
      { name: 'Multi-Head Attention', component: 'attention' },
      { name: 'Layer Normalization', component: 'norm' },
      { name: 'Feed-Forward Network', component: 'ffn' },
    ]
  },
  { name: 'Output Linear & Softmax', component: 'output' },
];

const TransformerSVG = ({ components, selectedComponent, setSelectedComponent, linkPositions }) => {
  const renderComponent = (x, y, width, height, component, label, mathNotation) => (
    <g key={component}>
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={components[component]?.color || "#f0f0f0"}
        stroke={selectedComponent === component ? "#000" : "#666"}
        strokeWidth={selectedComponent === component ? "3" : "1.5"}
        rx="5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: selectedComponent === component ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
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

  const renderArrow = (startX, startY, endX, endY, label, isMainFlow = false) => (
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

  return (
    <svg viewBox="0 0 800 760" className="w-full h-auto" style={{ background: '#f8f9fa' }}>
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

      {/* Render links from sidebar items to components */}
      {linkPositions.map((pos, index) => (
        <motion.line
          key={index}
          x1={pos.startX}
          y1={pos.startY}
          x2={pos.endX}
          y2={pos.endY}
          stroke="#000"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </svg>
  );
};

const EnhancedHierarchicalList = ({ items, selectedComponent, setSelectedComponent }) => {
  const handleClick = (component) => {
    setSelectedComponent(component);
  };

  return (
    <ul className="space-y-4 text-lg">
      {items.map((item, index) => (
        <li key={index} className="border-l-2 border-gray-300 pl-4">
          {item.component ? (
            <motion.button
              className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${
                selectedComponent === item.component 
                  ? 'font-semibold text-blue-700 bg-blue-100' 
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
              onClick={() => handleClick(item.component)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.name}
            </motion.button>
          ) : (
            <div className="font-bold text-xl mb-2 text-gray-800">{item.name}</div>
          )}
          {item.children && (
            <ul className="mt-2 space-y-2 ml-4">
              {item.children.map((child, childIndex) => (
                <li key={childIndex}>
                  <motion.button
                    className={`w-full text-left py-1 px-3 rounded-lg transition duration-200 ${
                      selectedComponent === child.component 
                        ? 'font-semibold text-blue-700 bg-blue-100' 
                        : 'text-gray-600 hover:bg-blue-50'
                    }`}
                    onClick={() => handleClick(child.component)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {child.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default function InteractiveTransformerArchitecture() {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const detailsRef = useRef(null);
  
  const linkPositions = [
    { startX: 400, startY: 110, endX: 400, endY: 130 }, // Input Embedding
    { startX: 400, startY: 180, endX: 400, endY: 250 }, // Positional Encoding
    { startX: 400, startY: 320, endX: 400, endY: 340 }, // Multi-Head Attention
    { startX: 400, startY: 390, endX: 400, endY: 410 }, // Layer Normalization
    { startX: 400, startY: 480, endX: 400, endY: 500 }, // Feed Forward Network
    { startX: 400, startY: 550, endX: 400, endY: 620 }, // Output Linear & Softmax
  ];

  useEffect(() => {
    if (selectedComponent && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedComponent]);

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Transformer Architecture: A Scientific Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <TransformerSVG
              components={components}
              selectedComponent={selectedComponent}
              setSelectedComponent={setSelectedComponent}
              linkPositions={linkPositions}
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Component Analysis</h2>
          <EnhancedHierarchicalList
            items={hierarchicalItems}
            selectedComponent={selectedComponent}
            setSelectedComponent={setSelectedComponent}
          />
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {selectedComponent && (
          <motion.div
            ref={detailsRef}
            key={selectedComponent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="mt-8 p-6 border border-gray-300 rounded-lg shadow-md"
          >
            <h3 className="text-3xl font-bold mb-4 text-gray-800">{components[selectedComponent].name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-semibold mb-2 text-gray-700">Mathematical Notation:</h4>
                <p className="font-mono mb-4 p-2 bg-gray-50 rounded">{components[selectedComponent].mathNotation}</p>
                <h4 className="text-xl font-semibold mb-2 text-gray-700">Description:</h4>
                <p className="text-gray-600 mb-4">{components[selectedComponent].description}</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2 text-gray-700">Mathematical Formulation:</h4>
                <p className="font-mono mb-4 p-2 bg-gray-50 rounded">{components[selectedComponent].formula}</p>
                <h4 className="text-xl font-semibold mb-2 text-gray-700">Key Points:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {components[selectedComponent].keyPoints.map((point, index) => (
                    <li key={index} className="text-gray-600">{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}