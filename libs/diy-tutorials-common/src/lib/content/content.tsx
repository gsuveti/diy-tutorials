import React from 'react';

import './content.scss';
import {RawHTML} from '../raw-html/raw-html';
import {serializeAttributes} from '../utils';

/* tslint:disable:no-empty-interface */
export interface ContentProps {
  className?: string;
  clientId?: string;
  children?: any;
  attributes?: {
    uuid: string;
    name: string;
  };
  html?: any;
}

export const Content = (props: ContentProps) => {
  const {className, clientId, html, children, attributes} = props;
  const content = children ?
    <div>
      {children}
    </div>
    :
    <RawHTML html={html}/>;

  return (
    <div className={className}
         data-client_id={clientId}
         data-attributes={serializeAttributes(attributes)}
    >
      {content}
    </div>
  );
};
