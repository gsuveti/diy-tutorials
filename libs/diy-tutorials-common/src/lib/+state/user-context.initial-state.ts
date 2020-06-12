import {TutorialState} from './tutorial.reducer';
import {UserContextState} from './user-context.reducer';
import {getSectionsPath} from './get-sections-path';

export function getUserContextInitialState(tutorialState: TutorialState): UserContextState {
    const {measurementForms, questions, products} = tutorialState;

    const displayedSections = getSectionsPath(tutorialState, tutorialState.sections[0].uuid);
    const instancesCountByMeasurementForm = measurementForms.reduce((obj, item) => {
        return {
            ...obj,
            [item.uuid]: 1
        }
    }, {});
    const productQuantities = products.reduce((productQuantities, {uuid}) => {
        return {
            ...productQuantities,
            [uuid]: 0
        }
    }, {});

    // if the tutorial doesn't have any measurements or questions show the products section
    const showProducts = !(measurementForms && measurementForms.length) && !(questions && questions.length);
    return {
        displayedSections,
        instancesCountByMeasurementForm,
        productQuantities,
        showProducts,
        selectedProductRange: null,
        selectedProducts: [],
        responses: {},
        measuredValues: {},
        measuredFormValues: {},
        questionOptions: {},
        displayedConditions: {},
        displayedProductTypes: {},
        displayedProducts: {},
        productRangePrices: {},
        commonProductsTotalPrice: null,
        emailMessage: null
    };
}
