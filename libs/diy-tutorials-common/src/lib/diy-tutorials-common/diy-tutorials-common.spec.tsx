import React from 'react';
import { render, cleanup } from 'react-testing-library';

import DiyTutorialsCommon from './diy-tutorials-common';

describe(' DiyTutorialsCommon', () => {
  afterEach(cleanup);

  it('should render successfully', () => {
    const { baseElement } = render(<DiyTutorialsCommon />);
    expect(baseElement).toBeTruthy();
  });
});
