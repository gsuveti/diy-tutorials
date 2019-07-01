import React from 'react';

import './tutorial.scss';
import {Section} from '../section/section';


/* tslint:disable:no-empty-interface */
export interface TutorialProps {
  children?: any;
  innerHTML?: any;
  innerBlocks?: any[];
  sections?: any[];
  attributes?: {};
}

export const Tutorial = (props: TutorialProps) => {

  const sections = props.sections.map(section => {
    return (
      <Section {...section}/>
    );
  });

  return (
    <div>
      <p>Tutorial</p>
      {props.children ? props.children : sections}
    </div>
  );
};

export default Tutorial;
