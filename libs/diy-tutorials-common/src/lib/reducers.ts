import { combineReducers } from 'redux';
import {tutorialReducer} from './tutorial/+state/tutorial.reducer';

export const reducers = combineReducers({
  tutorial: tutorialReducer
});
