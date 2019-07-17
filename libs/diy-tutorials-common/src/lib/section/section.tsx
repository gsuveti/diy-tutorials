import React from 'react';

import './section.scss';
import {Content} from '../content/content';
import {ConnectedQuestion} from '../question/question';
import {serializeAttributes} from '../utils';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {ConnectedMeasurementForm} from '../measurement-form/measurement-form';

/* tslint:disable:no-empty-interface */
export interface SectionProps {
  className?: string;
  clientId?: string;
  sectionIndex?: number;
  attributes?: {
    uuid: string
    submitForm: boolean
  };
  innerBlocks?: any[];
  children?: any;
}


const allowedComponents = {
  'irian/diy-question': ConnectedQuestion,
  'irian/diy-content': Content,
  'irian/diy-measurement-form': ConnectedMeasurementForm,
};


export const Section = (props: SectionProps) => {
  const {innerBlocks = [], children, className, attributes} = props;
  const {uuid} = attributes;

  return (
    <div className={className}
         data-attributes={serializeAttributes(attributes)}
    >
      {children}
      <InnerBlocksContent
        innerBlocks={innerBlocks}
        allowedComponents={allowedComponents}
      />
    </div>
  );
};

