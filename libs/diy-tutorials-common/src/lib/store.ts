import {AnyAction, applyMiddleware, compose, createStore, Store} from 'redux';
import {reducers} from "./reducers";
import {combineEpics, createEpicMiddleware} from 'redux-observable';
import {showProductsOrScrollToMeasurementsEpic} from './+state/epics/show-products-or-scroll-to-measurements.epic';
import {
    calculateAllMeasurementFormValuesEpic,
    calculateMeasurementFormValueEpic
} from './+state/epics/calculate-measurement-form-value.epic';
import {updatePriceForProductRangesEpic} from './+state/epics/update-price-for-product-ranges.epic';
import {loginWithProviderEpic} from './+state/epics/login-with-provider.epic';
import {updateDisplayedProductsEpic} from './+state/epics/update-displayed-products.epic';
import {saveUserDataEpic} from './+state/epics/save-user-data.epic';
import {resetResponsesEpic} from './+state/epics/reset-responses.epic';
import {logoutEpic} from './+state/epics/logout.epic';
import {updateDisplayedSectionsEpic} from './+state/epics/update-displayed-sections.epic';
import {updateDisplayedProductTypesEpic} from './+state/epics/update-displayed-product-types.epic';
import {hideProductsEpic} from './+state/epics/hide-products.epic';
import {initialTutorialState} from './+state/tutorial.reducer';
import {sendEmailWithInstructionsEpic} from './+state/epics/send-email-with-instructions.epic';
import {calculateProductQuantitiesEpic} from './+state/epics/calculate-product-quantities.epic';
import {getUserDataEpic} from './+state/epics/get-user-data.epic';
import {updateCommonProductsTotalPriceEpic} from './+state/epics/update-common-products-total-price.epic';
import {initialUserContextState} from './+state/user-context.reducer';
import {AppState} from './+state/app.state';
import {scrollToTopEpic} from './+state/epics/scroll-to-top.epic';
import {initialUserState} from './+state/user.reducer';
import {resetUserContextEpic} from './+state/epics/reset-user-context.epic';
import {resetMeasurementsEpic} from './+state/epics/reset-measurements.epic';
import {resetMeasurementInstancesEpic} from './+state/epics/reset-measurement-instances.epic';
import {loginWithEmailEpic} from './+state/epics/login-with-email.epic';
import {showProductsIfThereAreNoMeasurementsEpic} from './+state/epics/show-products-if-there-are-no-measurements.epic';
import {sendEmailWithProductsEpic} from './+state/epics/send-email-with-products.epic';
import {scrollToOptionalProducts} from './+state/epics/scroll-to-optional-products.epic';


const epicMiddleware = createEpicMiddleware();
const reduxDevtoolsExtension =
    (process.env.NODE_ENV !== 'production' && window && (window as any).__REDUX_DEVTOOLS_EXTENSION__)
        ?
        [(window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__({ trace: true })]
        :
        [];


export const rootEpic = combineEpics(
    getUserDataEpic,
    saveUserDataEpic,
    loginWithProviderEpic,
    loginWithEmailEpic,
    calculateMeasurementFormValueEpic,
    calculateAllMeasurementFormValuesEpic,
    calculateProductQuantitiesEpic,
    hideProductsEpic,
    updateDisplayedProductTypesEpic,
    updateDisplayedProductsEpic,
    updateDisplayedSectionsEpic,
    updatePriceForProductRangesEpic,
    updateCommonProductsTotalPriceEpic,
    resetResponsesEpic,
    sendEmailWithInstructionsEpic,
    sendEmailWithProductsEpic,
    logoutEpic,
    showProductsOrScrollToMeasurementsEpic,
    scrollToTopEpic,
    resetUserContextEpic,
    resetMeasurementsEpic,
    resetMeasurementInstancesEpic,
    showProductsIfThereAreNoMeasurementsEpic,
    scrollToOptionalProducts
);

export function configureStore(initialState: AppState = {
    tutorial: initialTutorialState,
    userContext: initialUserContextState,
    user: initialUserState
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


