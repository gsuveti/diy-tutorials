import React from 'react';

export interface Answer {
  uuid: string,
  text: string,
  value?: string,
  values?: string[],
  nextSection?: number
  section?: number
}

export interface ContextType {
  answers?: Answer[],
  addAnswer?: (answer: Answer) => void
  navigate?: (steps: number) => void
}

export const TutorialContext = React.createContext<ContextType>({
  answers: []
});
