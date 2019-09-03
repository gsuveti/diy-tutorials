import React from 'react';

import './hide-in-email.scss';

/* tslint:disable:no-empty-interface */
export interface HideInEmailProps {
  children?: any;
  className?: string;
}

export const HideInEmail = (props: HideInEmailProps) => {
  return (
    <div className={`${props.className} d-flex`} style={{'display': 'none'}}>
      {props.children}
    </div>
  );
};

export default HideInEmail;
