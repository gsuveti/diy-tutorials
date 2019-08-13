import React, {Component, ReactNode} from 'react';

import './question-option.scss';
import {serializeAttributes} from '../utils';

/* tslint:disable:no-empty-interface */
export interface QuestionOptionProps {
  children?: ReactNode;
  attributes?: {
    uuid: string;
    name: string;
    value: string;
    nextSection: string;
  }
}

export class QuestionOption extends Component<QuestionOptionProps> {
  render() {
    const {children, attributes} = this.props;

    return (
      <div className={``}
           data-attributes={serializeAttributes(attributes)}>
        {children}
      </div>
    );
  }
}
