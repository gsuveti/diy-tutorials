import React from 'react';

import './section.scss';
import {Content} from '../content/content';
import {Question} from '../question/question';

/* tslint:disable:no-empty-interface */
export interface SectionProps {
  children?: any;
  innerBlocks?: any[];
  blocks?: any[];
  attributes?: {};
}

export const Section = (props: SectionProps) => {

  const blocks = props.blocks.map(block => {
    if (block.name === 'content') {
      return (
        <Content key={block.key} innerHTML={block.html}/>
      );
    }
    return (
      <Question key={block.key}/>
    );
  });

  return (
    <div>
      <p>Section</p>
      {props.children ? props.children : blocks}
    </div>
  );
};

