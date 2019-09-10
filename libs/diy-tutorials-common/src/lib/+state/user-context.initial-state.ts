import {TutorialState} from './tutorial.reducer';
import {UserContextState} from './user-context.reducer';

export function getUserContextInitialState(tutorialState: TutorialState): UserContextState {

  const displayedSections = [tutorialState.sections[0].uuid];
  const instancesCountByMeasurementForm = tutorialState.measurementForms.reduce((obj, item) => {
    return {
      ...obj,
      [item.uuid]: 1
    }
  }, {});
  const productQuantities = tutorialState.products.reduce((productQuantities, {uuid}) => {
    return {
      ...productQuantities,
      [uuid]: 0
    }
  }, {});

  return {
    displayedSections,
    instancesCountByMeasurementForm,
    productQuantities,
    showProducts: false,
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
    commonProductsTotalPrice: null
  };
}
