import React from 'react';
import { motion } from 'framer-motion';

const HierarchicalList = ({ items, selectedComponent, setSelectedComponent }) => {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index}>
          {item.component ? (
            <motion.button
              className={`text-left w-full py-1 px-2 rounded ${
                selectedComponent === item.component ? 'bg-blue-100 font-bold' : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedComponent(item.component)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.name}
            </motion.button>
          ) : (
            <span className="font-semibold">{item.name}</span>
          )}
          {item.children && (
            <ul className="pl-4 mt-1 space-y-1">
              {item.children.map((child, childIndex) => (
                <li key={childIndex}>
                  <motion.button
                    className={`text-left w-full py-1 px-2 rounded ${
                      selectedComponent === child.component ? 'bg-blue-100 font-bold' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedComponent(child.component)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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

export default HierarchicalList;