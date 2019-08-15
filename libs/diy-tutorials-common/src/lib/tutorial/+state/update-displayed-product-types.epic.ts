import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddResponse, TutorialActionTypes, updateDisplayedProductTypes} from './tutorial.actions';
import {map} from 'rxjs/operators';
import {AppState} from '../../store';

import {filterBlocksByName} from '../../utils';
import {TutorialState} from './tutorial.reducer';
import {BlockNames} from '../../constants';

export const updateDisplayedProductTypesEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.ShowProducts, TutorialActionTypes.UserDataFetched),
    map((action: AddResponse) => {
      const state = state$.value.tutorial;
      return filterBlocksByName(state.blocks, BlockNames.ProductType)
        .reduce((displayedProductTypes, {uuid}) => {
          return {
            [uuid]: isDisplayed(state, state.displayedConditions[uuid]),
            ...displayedProductTypes
          };
        }, {});
    }),
    map(displayedProductTypes => updateDisplayedProductTypes(displayedProductTypes))
  );
};

function isDisplayed(state: TutorialState, displayedConditions: { question: string, response: string }[] = []): boolean {
  return displayedConditions.reduce((displayed, condition) => {
    const response = state.responses[condition.question];
    return displayed && response && (response.responseUUID === condition.response);
  }, true);
}
