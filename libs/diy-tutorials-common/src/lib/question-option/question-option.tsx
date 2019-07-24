import React, {Component, ReactNode} from 'react';

import './question-option.scss';
import {serializeAttributes} from '../utils';

/* tslint:disable:no-empty-interface */
export interface QuestionOptionProps {
  children?: ReactNode;
  className?: string;
  attributes?: {
    uuid: string;
    name: string;
    value: string;
    nextSection: string;
  }
}

export class QuestionOption extends Component<QuestionOptionProps> {
  render() {
    const {children, className, attributes} = this.props;

    return (
      <div className={`${className ? className : ''}`}
           data-attributes={serializeAttributes(attributes)}>
        {children}
      </div>
    );
  }
}
