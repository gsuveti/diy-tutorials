import {TutorialState} from './tutorial.reducer';
import {UserContextState} from './user-context.reducer';
import {UserState} from './user.reducer';

export interface AppState {
  tutorial: TutorialState;
  userContext: UserContextState;
  user: UserState;
}
