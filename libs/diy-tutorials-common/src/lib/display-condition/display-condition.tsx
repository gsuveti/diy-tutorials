import React, {Component} from 'react';

import './display-condition.scss';
import {serializeAttributes} from '../utils';

/* tslint:disable:no-empty-interface */
export interface DisplayConditionProps {
  children?: any;
  attributes?: {
    question: string;
    condition: string;
    response: string;
  }
}

export class DisplayCondition extends Component<DisplayConditionProps> {

  render() {
    const {children, attributes} = this.props;

    return (
      <div data-attributes={serializeAttributes(attributes)}>
        {children}
      </div>
    );
  }
}
