import React, { createContext, useState, useContext, useCallback } from 'react';

// Create a context for the tooltip
const TooltipContext = createContext({
  open: false,
  setOpen: (open: boolean) => {},
});

// TooltipProvider component
export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      {children}
    </TooltipContext.Provider>
  );
};

// Tooltip component
export const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TooltipProvider>
      <div className="relative inline-block">{children}</div>
    </TooltipProvider>
  );
};

// TooltipTrigger component
export const TooltipTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setOpen } = useContext(TooltipContext);

  const handleMouseEnter = useCallback(() => setOpen(true), [setOpen]);
  const handleMouseLeave = useCallback(() => setOpen(false), [setOpen]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// TooltipContent component
export const TooltipContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open } = useContext(TooltipContext);

  if (!open) return null;

  return (
    <div className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700">
      {children}
      <div className="tooltip-arrow" data-popper-arrow></div>
    </div>
  );
};

// Usage example:
// <Tooltip>
//   <TooltipTrigger>
//     <button>Hover me</button>
//   </TooltipTrigger>
//   <TooltipContent>
//     This is the tooltip content
//   </TooltipContent>
// </Tooltip>