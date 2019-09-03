import {AnyAction, applyMiddleware, compose, createStore, Store} from 'redux';
import {reducers} from "./reducers";
import {combineEpics, createEpicMiddleware} from 'redux-observable';
import {initialTutorialState, TutorialState} from './tutorial/+state/tutorial.reducer';
import {getUserDataEpic} from './tutorial/+state/get-user-data.epic';
import {saveUserDataEpic} from './tutorial/+state/save-user-data.epic';
import {updateDisplayedProductTypesEpic} from './tutorial/+state/update-displayed-product-types.epic';
import {updateDisplayedSectionsEpic} from './tutorial/+state/update-displayed-sections.epic';
import {resetResponsesEpic} from './tutorial/+state/reset-responses.epic';
import {hideProductsEpic} from './tutorial/+state/hide-products.epic';
import {
  calculateAllMeasurementFormValuesEpic,
  calculateMeasurementFormValueEpic
} from './tutorial/+state/calculate-measurement-form-value.epic';
import {calculateProductQuantitiesEpic} from './tutorial/+state/calculate-product-quantities.epic';
import {loginWithProviderEpic} from './tutorial/+state/login-with-provider.epic';
import {updateDisplayedProductsEpic} from './tutorial/+state/update-displayed-products.epic';
import {updateCommonProductsTotalPriceEpic} from './tutorial/+state/update-common-products-total-price.epic';
import {updatePriceForProductRangesEpic} from './tutorial/+state/update-price-for-product-ranges.epic';


export interface AppState {
  tutorial: TutorialState;
  firestore?: any;
}

const epicMiddleware = createEpicMiddleware();
const reduxDevtoolsExtension = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION__) ? [(window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()] : [];


export const rootEpic = combineEpics(
  getUserDataEpic,
  saveUserDataEpic,
  loginWithProviderEpic,
  calculateMeasurementFormValueEpic,
  calculateAllMeasurementFormValuesEpic,
  calculateProductQuantitiesEpic,
  hideProductsEpic,
  updateDisplayedProductTypesEpic,
  updateDisplayedProductsEpic,
  updateDisplayedSectionsEpic,
  updatePriceForProductRangesEpic,
  updateCommonProductsTotalPriceEpic,
  resetResponsesEpic
);

export function configureStore(initialState: AppState = {
  tutorial: initialTutorialState
}): Store<AppState, AnyAction> {
  const store = createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(epicMiddleware),
      ...reduxDevtoolsExtension
    )
  );
  // @ts-ignore
  epicMiddleware.run(rootEpic);
  return store;
}


