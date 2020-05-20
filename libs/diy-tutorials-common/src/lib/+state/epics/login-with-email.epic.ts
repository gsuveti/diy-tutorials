import {Observable, of} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {TutorialActionTypes} from '../tutorial.actions';
import {ignoreElements, switchMap} from 'rxjs/operators';
import {AppState} from '../app.state';


export const loginWithEmailEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
    return action$.pipe(
        ofType(TutorialActionTypes.LoginWithEmail),
        switchMap((action: AnyAction) => {

                const {email} = action;

                return of();
            },
        ),
        ignoreElements()
    );
};
