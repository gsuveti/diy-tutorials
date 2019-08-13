import React from 'react';

import './content.scss';
import {RawHTML} from '../raw-html/raw-html';
import {serializeAttributes} from '../utils';

/* tslint:disable:no-empty-interface */
export interface ContentProps {
  clientId?: string;
  children?: any;
  attributes?: {
    uuid: string;
    name: string;
  };
  html?: any;
}

export const Content = (props: ContentProps) => {
  const {clientId, html, children, attributes} = props;
  const content = children ?
    <div>
      {children}
    </div>
    :
    <RawHTML html={html}/>;

  return (
    <div
      data-client_id={clientId}
      data-attributes={serializeAttributes(attributes)}
    >
      {content}
    </div>
  );
};
