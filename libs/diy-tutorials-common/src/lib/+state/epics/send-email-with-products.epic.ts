import {from, Observable, of} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {TutorialActionTypes} from '../tutorial.actions';
import {map, switchMap} from 'rxjs/operators';
import {AppState} from '../app.state';
import * as firebase from 'firebase/app';
import {
    getDisplayedOptionalProducts,
    getDisplayedProductsFromSelectedProductRange
} from '../selectors/tutorial.selectors';


export const sendEmailWithProductsEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
    return action$.pipe(
        ofType(TutorialActionTypes.SendEmailWithProducts),
        switchMap((action: {}) => {
            const state = state$.value;

            const {
                selectedProductRange, productQuantities
            } = state$.value.userContext;
            const {email} = state.user;

            if (selectedProductRange) {
                const selectedProducts = getDisplayedProductsFromSelectedProductRange(state);
                const selectedOptionalProducts = getDisplayedOptionalProducts(state);

                const data = {
                    title: getTitleText(),
                    email,
                    products: selectedProducts.concat(selectedOptionalProducts),
                    tutorialUrl: window.location.href,
                    createdAt: new Date().toISOString(),
                    productQuantities,
                };

                return from(firebase.firestore().collection(`emails`).add(data)).pipe(
                    map(() => {
                        return {type: TutorialActionTypes.EmailSent}
                    })
                );
            } else {
                return of({type: TutorialActionTypes.EmailNotSent});
            }
        })
    );
};

function getTitleText() {
    return document.querySelector('.post .entry-title').innerHTML;
}
