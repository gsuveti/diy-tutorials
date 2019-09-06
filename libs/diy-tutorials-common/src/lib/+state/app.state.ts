import {TutorialState} from './tutorial.reducer';
import {UserContextState} from './user-context.reducer';

export interface AppState {
  tutorial: TutorialState;
  userContext: UserContextState;
}
