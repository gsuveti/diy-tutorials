import React from 'react';

import './show-in-email.scss';

/* tslint:disable:no-empty-interface */
export interface ShowInEmailProps {
  children?: any;
}

export const ShowInEmail = (props: ShowInEmailProps) => {
  return (
    <div className="d-none">
      {props.children}
    </div>
  );
};

export default ShowInEmail;
