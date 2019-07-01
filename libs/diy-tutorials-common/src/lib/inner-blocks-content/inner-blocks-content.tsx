import React from 'react';

import './inner-blocks-content.scss';
import {RawHTML} from '../raw-html/raw-html';
import {Section} from '../section/section';

/* tslint:disable:no-empty-interface */
export interface InnerBlocksContentProps {
  innerBlocks?: any[];

}

export const InnerBlocksContent = (props: InnerBlocksContentProps) => {
  const {innerBlocks} = props;

  const blocks = !innerBlocks ? [] : innerBlocks.map((block) => {
    if (block.name.startsWith("irian/")) {
      return (
        <Section key={block.clientId} {...block}>
          <InnerBlocksContent innerBlocks={block.innerBlocks}/>
        </Section>
      )
    } else  {
      return (
        <RawHTML key={block.clientId} html={block.html}/>
      );
    }
  });

  return (
    <React.Fragment>{blocks}</React.Fragment>
  );
};
