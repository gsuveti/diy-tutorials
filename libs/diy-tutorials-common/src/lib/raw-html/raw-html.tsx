import React from 'react';

import './raw-html.scss';

/* tslint:disable:no-empty-interface */
export interface RawHTMLProps {
  html: string;
}

export const RawHTML = (props: RawHTMLProps) => {

  if (props.html) {
    return (
      <div dangerouslySetInnerHTML={{__html: props.html.replace("\\n", "")}}>
      </div>
    );
  }
  return null;
};
