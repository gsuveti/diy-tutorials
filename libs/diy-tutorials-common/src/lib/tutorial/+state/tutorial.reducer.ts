import {
  AddMeasurement,
  AddResponse,
  ChangeInstancesCount,
  GetUserData,
  HideProducts,
  ResetResponses,
  SelectProduct,
  SelectProductRange,
  ShowProducts,
  TutorialActionTypes,
  UpdateDisplayedProductTypes,
  UpdateDisplayedSections,
  UpdateMeasurementFormValue,
  UpdateProductQuantities,
  UserDataFetched
} from './tutorial.actions';
import {createReducer} from 'redux-starter-kit'
import {Response} from '../../models/response.model';
import {BlockAttributes} from '../../models/block-attributes.model';

const FormulaParser = require('hot-formula-parser').Parser;

export interface TutorialState {
  uuid?: string;
  userUID?: string;
  blocks: BlockAttributes[];
  sections: BlockAttributes[],
  sectionsWithRedirect: string[],
  displayedSections: string[],
  questions: BlockAttributes[],
  measurements: BlockAttributes[],
  measurementForms: BlockAttributes[],
  measurementFormsOrder: string[],
  products: BlockAttributes[],
  commonProducts: BlockAttributes[],
  optionalProducts: BlockAttributes[],
  productRanges: BlockAttributes[],
  productQuantities: { [uuid: string]: number };
  questionOptions: { [uuid: string]: any };
  displayedConditions: { [uuid: string]: any };
  displayedProductTypes: { [uuid: string]: boolean };


  // data that is saved in firebase
  // todo
  //  extract in other state
  responses: { [uuid: string]: Response };
  measuredValues: { [uuid: string]: { [instanceIndex: string]: string } };
  instancesCountByMeasurementForm: { [uuid: string]: number };
  measuredFormValues: { [uuid: string]: number };
  showProducts: boolean,
  selectedProducts: string[],
  selectedProductRange: string,
}

export const initialTutorialState: TutorialState = {
  uuid: null,
  userUID: null,
  blocks: [],
  sections: [],
  sectionsWithRedirect: [],
  displayedSections: [],
  questions: [],
  measurements: [],
  measurementForms: [],
  measurementFormsOrder: [],
  showProducts: false,
  productRanges: [],
  selectedProductRange: null,
  selectedProducts: [],
  products: [],
  optionalProducts: [],
  commonProducts: [],
  productQuantities: {},
  responses: {},
  measuredValues: {},
  measuredFormValues: {},
  instancesCountByMeasurementForm: {},
  questionOptions: {},
  displayedConditions: {},
  displayedProductTypes: {},
};

export const tutorialReducer = createReducer(initialTutorialState, {
  [TutorialActionTypes.AddResponse]: (state: TutorialState, action: AddResponse) => {
    const {answer} = action.payload;
    const {questionUUID} = answer;


    state.responses[questionUUID] = answer;


    return state;
  },

  [TutorialActionTypes.ShowProducts]: (state: TutorialState, action: ShowProducts) => {
    const measurementFormWithoutValue = state.measurementForms.find(measurementForm => {
      return !state.measuredFormValues[measurementForm.uuid];
    });

    if (measurementFormWithoutValue) {
      document.getElementById(measurementFormWithoutValue.uuid).scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      state.showProducts = true;
    }

    return state;
  },

  [TutorialActionTypes.HideProducts]: (state: TutorialState, action: HideProducts) => {
    state.showProducts = false;
    state.selectedProductRange = null;
    state.selectedProducts = [];
    return state;
  },

  [TutorialActionTypes.AddMeasurement]: (state: TutorialState, action: AddMeasurement) => {
    const {uuid, value, instanceIndex} = action.payload;

    state.measuredValues[uuid] = {
      ...state.measuredValues[uuid],
      [instanceIndex]: value
    };

    return state;
  },
  [TutorialActionTypes.ChangeInstancesCount]: (state: TutorialState, action: ChangeInstancesCount) => {
    const {uuid, count} = action.payload;
    state.instancesCountByMeasurementForm[uuid] = count;

    return state;
  },
  [TutorialActionTypes.SelectProductRange]: (state: TutorialState, action: SelectProductRange) => {
    const {productRangeUUID} = action.payload;
    state.selectedProductRange = productRangeUUID;
    return state;
  },
  [TutorialActionTypes.SelectProduct]: (state: TutorialState, action: SelectProduct) => {
    const {productUUID} = action.payload;
    if (state.selectedProducts.indexOf(productUUID) < 0) {
      state.selectedProducts.push(productUUID)
    }
    return state;
  },
  [TutorialActionTypes.RemoveProduct]: (state: TutorialState, action: SelectProduct) => {
    const {productUUID} = action.payload;
    const index = state.selectedProducts.indexOf(productUUID);
    if (index > -1) {
      state.selectedProducts.splice(index, 1);
    }
    return state;
  },
  [TutorialActionTypes.GetUserData]: (state: TutorialState, action: GetUserData) => {
    const {userUID} = action.payload;
    state.userUID = userUID;
    return state;
  },
  [TutorialActionTypes.UserDataFetched]: (state: TutorialState, action: UserDataFetched) => {
    const {data} = action.payload;
    console.log("UserDataFetched");

    state = {
      ...state,
      ...data
    };
    return state;
  },
  [TutorialActionTypes.UserDataSaved]: (state: TutorialState, action: UserDataFetched) => {
    console.log("UserDataSaved");
    return state;
  },
  [TutorialActionTypes.UpdateDisplayedProductTypes]: (state: TutorialState, action: UpdateDisplayedProductTypes) => {
    const {displayedProductTypes} = action.payload;
    state.displayedProductTypes = displayedProductTypes;
    return state;
  },
  [TutorialActionTypes.UpdateDisplayedSections]: (state: TutorialState, action: UpdateDisplayedSections) => {
    const {displayedSections} = action.payload;
    state.displayedSections = displayedSections;
    return state;
  },
  [TutorialActionTypes.ResetResponses]: (state: TutorialState, action: ResetResponses) => {
    const {questions} = action.payload;
    questions.map(uuid => {
      state.responses[uuid] = {};
    });
    return state;
  },
  [TutorialActionTypes.UpdateMeasurementFormValue]: (state: TutorialState, action: UpdateMeasurementFormValue) => {
    const {uuid, value} = action.payload;
    state.measuredFormValues[uuid] = value;
    return state;
  },
  [TutorialActionTypes.UpdateProductQuantities]: (state: TutorialState, action: UpdateProductQuantities) => {
    const {productQuantities} = action.payload;
    state.productQuantities = productQuantities;
    return state;
  }
});
