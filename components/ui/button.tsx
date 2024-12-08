import React, { createContext, useContext, useState } from 'react';

// Accordion Components
const AccordionContext = createContext(null);

export const Accordion = ({ children, type = "single", defaultValue = "", collapsible = false }) => {
  const [expanded, setExpanded] = useState(defaultValue);

  return (
    <AccordionContext.Provider value={{ expanded, setExpanded, type, collapsible }}>
      <div className="divide-y divide-gray-200">{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({ children, value }) => {
  const { expanded, setExpanded, type, collapsible } = useContext(AccordionContext);
  const isExpanded = expanded === value || (type === "multiple" && expanded.includes(value));

  const toggleExpanded = () => {
    if (type === "single") {
      setExpanded(isExpanded && collapsible ? "" : value);
    } else if (type === "multiple") {
      setExpanded(
        isExpanded
          ? expanded.filter((v) => v !== value)
          : [...expanded, value]
      );
    }
  };

  return (
    <div className="py-2">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isExpanded, toggleExpanded, value })
      )}
    </div>
  );
};

export const AccordionTrigger = ({ children, isExpanded, toggleExpanded }) => (
  <button
    className="flex justify-between w-full py-2 text-left text-gray-900 hover:bg-gray-50"
    onClick={toggleExpanded}
  >
    {children}
    <span className="ml-6 flex items-center">
      {isExpanded ? (
        <ChevronUpIcon className="h-5 w-5" />
      ) : (
        <ChevronDownIcon className="h-5 w-5" />
      )}
    </span>
  </button>
);

export const AccordionContent = ({ children, isExpanded }) => (
  <div className={`mt-2 ${isExpanded ? 'block' : 'hidden'}`}>{children}</div>
);

// Button Component
export const Button = ({ children, variant = "default", size = "default", ...props }) => {
  const baseClasses = "font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizeClasses = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
  };

  const className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

// Icon components
const ChevronUpIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDownIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);