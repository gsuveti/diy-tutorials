import { getGreeting } from '../support/app.po';

describe('diy-tutorials-backend', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to diy-tutorials-backend!');
  });
});
