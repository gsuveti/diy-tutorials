import React from 'react';

import './section.scss';
import {Content} from '../content/content';
import {Question} from '../question/question';
import {serializeAttributes} from '../utils';

/* tslint:disable:no-empty-interface */
export interface SectionProps {
  className?: string;
  clientId?: string;
  attributes?: {};
  innerBlocks?: any[];
  children?: any;
}

export const Section = (props: SectionProps) => {
  const {innerBlocks = [], children, className, attributes, clientId} = props;

  const content = children ? children : innerBlocks.map(block => {
    if (block.name === 'content') {
      return (
        <Content key={block.key} {...block}/>
      );
    }
    return (
      <Question key={block.key} {...block}/>
    );
  });

  return (
    <div className={className}
         data-client_id={clientId}
         data-attributes={serializeAttributes(attributes)}
    >
      {content}
    </div>
  );
};

