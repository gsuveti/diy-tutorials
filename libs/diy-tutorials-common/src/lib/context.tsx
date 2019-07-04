import React from 'react';

interface ContextType {
  filters: any,
  addFilter?: (any) => void
  navigate?: (steps: number) => void
}

export const TutorialContext = React.createContext<ContextType>({
  filters: undefined
});
