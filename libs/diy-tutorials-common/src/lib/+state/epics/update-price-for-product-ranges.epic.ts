import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddResponse, TutorialActionTypes, updatePriceForProductRanges} from '../tutorial.actions';
import {map} from 'rxjs/operators';
import {AppState} from '../app.state';

export const updatePriceForProductRangesEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
    return action$.pipe(
        ofType(TutorialActionTypes.UpdateDisplayedProducts, TutorialActionTypes.UpdateProductQuantities),
        map((action: AddResponse) => {
            const state = state$.value;
            const {products, productRanges} = state.tutorial;
            const {displayedProducts, productQuantities} = state.userContext;

            return productRanges.reduce((prices, productRange) => {
                const total = products
                    .filter(product => product.parentBlockUUID === productRange.uuid)
                    .filter(product => displayedProducts[product.uuid])
                    .reduce((total, product) => {
                        return total + product.price * productQuantities[product.uuid];
                    }, 0);

                return {
                    ...prices,
                    [productRange.uuid]: total
                }
            }, {})

        }),
        map(prices => updatePriceForProductRanges(prices))
    );
};
