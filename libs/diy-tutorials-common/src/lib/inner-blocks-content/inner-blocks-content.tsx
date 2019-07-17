import React, {ComponentType} from 'react';

import './inner-blocks-content.scss';
import {Block} from '../models/block.model';


/* tslint:disable:no-empty-interface */
export interface InnerBlocksContentProps {
  innerBlocks?: any[];
  allowedComponents: {
    [name: string]: ComponentType<any>
  }
}

export const InnerBlocksContent = (props: InnerBlocksContentProps) => {
  const {innerBlocks} = props;
  const {allowedComponents = {}} = props;

  const blocks = !innerBlocks ? [] : innerBlocks.map((block: Block) => {
    const component = allowedComponents[block.attributes.name];
    return component ? React.createElement(component, {...block}) : null;
  });

  return (
    <React.Fragment>{blocks}</React.Fragment>
  );
};

