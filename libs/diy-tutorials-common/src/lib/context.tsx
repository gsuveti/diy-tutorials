import React from 'react';

export interface Answer {
  uuid: string,
  text: string,
  value?: string,
  values?: string[],
  nextSection?: number
  sectionIndex?: number
  goToNextSection?: boolean
}

export interface ContextType {
  answers?: Answer[],
  addAnswer?: (answer: Answer) => void
  navigate?: (steps: number) => void
}

export const TutorialContext = React.createContext<ContextType>({
  answers: []
});
