import {combineReducers} from 'redux';
import {userContextReducer} from './+state/user-context.reducer';
import {tutorialReducer} from './+state/tutorial.reducer';

export const reducers = combineReducers({
  tutorial: tutorialReducer,
  userContext: userContextReducer
});
