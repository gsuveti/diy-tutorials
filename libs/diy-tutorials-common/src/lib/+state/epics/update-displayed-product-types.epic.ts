import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddResponse, TutorialActionTypes, updateDisplayedProductTypes} from '../tutorial.actions';
import {map} from 'rxjs/operators';
import {AppState} from '../../store';

import {filterBlocksByName} from '../../utils';
import {BlockNames} from '../../constants';
import {UserContextState} from '../user-context.reducer';

export const updateDisplayedProductTypesEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.ShowProducts, TutorialActionTypes.UserDataFetched),
    map((action: AddResponse) => {
      const state = state$.value;
      const tutorialState = state.tutorial;
      const userContextState = state.userContext;

      return filterBlocksByName(tutorialState.blocks, BlockNames.ProductType)
        .reduce((displayedProductTypes, {uuid}) => {
          return {
            [uuid]: isDisplayed(userContextState, tutorialState.displayedConditions[uuid]),
            ...displayedProductTypes
          };
        }, {});
    }),
    map(displayedProductTypes => updateDisplayedProductTypes(displayedProductTypes))
  );
};

function isDisplayed(state: UserContextState, displayedConditions: { question: string, response: string }[] = []): boolean {
  return displayedConditions.reduce((displayed, condition) => {
    const response = state.responses[condition.question];
    return displayed && response && (response.responseUUID === condition.response);
  }, true);
}
