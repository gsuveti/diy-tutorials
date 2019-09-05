import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddResponse, TutorialActionTypes, updateDisplayedProducts} from '../tutorial.actions';
import {map} from 'rxjs/operators';
import {AppState} from '../../store';

export const updateDisplayedProductsEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.UpdateDisplayedProductTypes),
    map((action: AddResponse) => {
      const state = state$.value;
      const tutorialState = state.tutorial;
      const userContextState = state.userContext;

      const {products} = tutorialState;
      const {displayedProductTypes} = userContextState;

      return products.reduce((displayedProducts, product) => {
        return {
          ...displayedProducts,
          [product.uuid]: product.productType ? displayedProductTypes[product.productType] : true
        }
      }, {})
    }),
    map(displayedProducts => updateDisplayedProducts(displayedProducts))
  );
};
