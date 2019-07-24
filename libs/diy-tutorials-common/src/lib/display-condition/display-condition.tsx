import React, {Component} from 'react';

import './display-condition.scss';
import {serializeAttributes} from '../utils';

/* tslint:disable:no-empty-interface */
export interface DisplayConditionProps {
  className?: string;
  children?: any;
  attributes?: {
    question: string;
    condition: string;
    response: string;
  }
}

export class DisplayCondition extends Component<DisplayConditionProps> {

  render() {
    const {className, children, attributes} = this.props;

    return (
      <div className={className}
           data-attributes={serializeAttributes(attributes)}>
        {children}
      </div>
    );
  }
}
