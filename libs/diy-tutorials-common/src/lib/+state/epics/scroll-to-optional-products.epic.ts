import {EMPTY, Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {ignoreElements, map, tap} from 'rxjs/operators';
import {AppState} from '@diy-tutorials/diy-tutorials-common';
import {TutorialActionTypes} from '../tutorial.actions';


export const scrollToOptionalProducts = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
    return action$.pipe(
        ofType(TutorialActionTypes.SelectProductRange),
        tap((action: any) => {
            const element = document.getElementById('optional-products');

            window.scrollTo({
                behavior: 'smooth',
                top:  element.offsetTop
            });

        }),
        ignoreElements()
    );
};
