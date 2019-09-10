import {combineReducers} from 'redux';
import {userContextReducer} from './+state/user-context.reducer';
import {tutorialReducer} from './+state/tutorial.reducer';
import {userReducer} from './+state/user.reducer';

export const reducers = combineReducers({
  tutorial: tutorialReducer,
  userContext: userContextReducer,
  user: userReducer
});
