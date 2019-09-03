import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddResponse, TutorialActionTypes, updateCommonProductsTotalPrice} from './tutorial.actions';
import {map} from 'rxjs/operators';
import {AppState} from '../../store';

export const updateCommonProductsTotalPriceEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.UpdateDisplayedProducts),
    map((action: AddResponse) => {
      const state = state$.value.tutorial;
      const {commonProducts, displayedProducts, productQuantities} = state;

      return commonProducts
        .filter(product => displayedProducts[product.uuid])
        .reduce((total, product) => {
          return total + product.price * productQuantities[product.uuid];
        }, 0);
    }),
    map(price => updateCommonProductsTotalPrice(price))
  );
};
