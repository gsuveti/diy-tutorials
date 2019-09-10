import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {TutorialActionTypes} from '../tutorial.actions';
import {ignoreElements, tap} from 'rxjs/operators';
import {AppState} from '@diy-tutorials/diy-tutorials-common';


export const scrollToTopEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.ResetUserContext),
    tap((action: AnyAction) => {
        document.querySelector('.post').scrollIntoView({
          behavior: 'smooth'
        });
      }
    ),
    ignoreElements()
  );
};
