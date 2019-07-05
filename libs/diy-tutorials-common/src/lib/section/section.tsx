import React from 'react';

import './section.scss';
import {Content} from '../content/content';
import {Question} from '../question/question';
import {serializeAttributes} from '../utils';
import {TutorialContext} from '../context';

/* tslint:disable:no-empty-interface */
export interface SectionProps {
  className?: string;
  clientId?: string;
  attributes?: {
    submitForm:boolean
  };
  innerBlocks?: any[];
  children?: any;
  isServer?: boolean;
}

export const Section = (props: SectionProps) => {
  const {innerBlocks = [], children, className, attributes, clientId, isServer} = props;

  const blocks = innerBlocks.map(block => {
    if (block.name === 'content') {
      return (
        <Content key={block.key} {...block}/>
      );
    }
    return (
      <TutorialContext.Consumer key={block.key}>
        {({filters, addFilter}) => (
          <Question {...block} addFilter={addFilter} answer={filters[block.attributes.uuid]}/>
        )}
      </TutorialContext.Consumer>
    );
  });

  return (
    <div className={className}
         data-client_id={clientId}
         data-attributes={serializeAttributes(attributes)}
    >
      {children}
      {blocks}
    </div>
  );
};

