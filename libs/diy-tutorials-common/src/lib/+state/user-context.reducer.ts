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
  UpdateCommonProductsTotalPrice,
  UpdateDisplayedProducts,
  UpdateDisplayedProductTypes,
  UpdateDisplayedSections,
  UpdateMeasurementFormValue,
  UpdatePriceForProductRanges,
  UpdateProductQuantities,
  UserDataFetched
} from './tutorial.actions';
import {createReducer} from 'redux-starter-kit'
import {Response} from '../models/response.model';
import * as firebase from 'firebase';

export interface UserContextState {
  user?: firebase.User;
  productQuantities: { [uuid: string]: number };
  questionOptions: { [uuid: string]: any };
  displayedConditions: { [uuid: string]: any };
  displayedProductTypes: { [uuid: string]: boolean };
  displayedProducts: { [uuid: string]: boolean };
  productRangePrices: { [uuid: string]: number };
  commonProductsTotalPrice: number;
  displayedSections: string[],

  responses: { [uuid: string]: Response };
  measuredValues: { [uuid: string]: { [instanceIndex: string]: string } };
  instancesCountByMeasurementForm: { [uuid: string]: number };
  measuredFormValues: { [uuid: string]: number };
  showProducts: boolean,
  selectedProducts: string[],
  selectedProductRange: string,
}

export const initialUserContextState: UserContextState = {
  user: null,
  showProducts: false,
  selectedProductRange: null,
  selectedProducts: [],
  productQuantities: {},
  responses: {},
  measuredValues: {},
  measuredFormValues: {},
  instancesCountByMeasurementForm: {},
  questionOptions: {},
  displayedConditions: {},
  displayedProductTypes: {},
  displayedProducts: {},
  productRangePrices: {},
  displayedSections: [],
  commonProductsTotalPrice: null

};

export const userContextReducer = createReducer(initialUserContextState, {
  [TutorialActionTypes.AddResponse]: (state: UserContextState, action: AddResponse) => {
    const {answer} = action.payload;
    const {questionUUID} = answer;

    state.responses[questionUUID] = answer;
    return state;
  },
  [TutorialActionTypes.ShowProducts]: (state: UserContextState, action: ShowProducts) => {
    state.showProducts = true;
    return state;
  },

  [TutorialActionTypes.HideProducts]: (state: UserContextState, action: HideProducts) => {
    state.showProducts = false;
    state.selectedProductRange = null;
    state.selectedProducts = [];
    return state;
  },
  [TutorialActionTypes.AddMeasurement]: (state: UserContextState, action: AddMeasurement) => {
    const {uuid, value, instanceIndex} = action.payload;

    state.measuredValues[uuid] = {
      ...state.measuredValues[uuid],
      [instanceIndex]: value
    };

    return state;
  },
  [TutorialActionTypes.ChangeInstancesCount]: (state: UserContextState, action: ChangeInstancesCount) => {
    const {uuid, count} = action.payload;
    state.instancesCountByMeasurementForm[uuid] = count;

    return state;
  },
  [TutorialActionTypes.SelectProductRange]: (state: UserContextState, action: SelectProductRange) => {
    const {productRangeUUID} = action.payload;
    state.selectedProductRange = productRangeUUID;
    return state;
  },
  [TutorialActionTypes.SelectProduct]: (state: UserContextState, action: SelectProduct) => {
    const {productUUID} = action.payload;
    if (state.selectedProducts.indexOf(productUUID) < 0) {
      state.selectedProducts.push(productUUID)
    }
    return state;
  },
  [TutorialActionTypes.RemoveProduct]: (state: UserContextState, action: SelectProduct) => {
    const {productUUID} = action.payload;
    const index = state.selectedProducts.indexOf(productUUID);
    if (index > -1) {
      state.selectedProducts.splice(index, 1);
    }
    return state;
  },
  [TutorialActionTypes.GetUserData]: (state: UserContextState, action: GetUserData) => {
    const {user} = action.payload;
    state.user = user;
    return state;
  },
  [TutorialActionTypes.UserDataFetched]: (state: UserContextState, action: UserDataFetched) => {
    const {data} = action.payload;
    console.log("UserDataFetched");
    console.log(data);

    state = {
      ...state,
      ...data
    };
    return state;
  },
  [TutorialActionTypes.UserDataSaved]: (state: UserContextState, action: UserDataFetched) => {
    console.log("UserDataSaved");
    return state;
  },
  [TutorialActionTypes.UpdateDisplayedProductTypes]: (state: UserContextState, action: UpdateDisplayedProductTypes) => {
    const {displayedProductTypes} = action.payload;
    state.displayedProductTypes = displayedProductTypes;
    return state;
  },
  [TutorialActionTypes.UpdateDisplayedSections]: (state: UserContextState, action: UpdateDisplayedSections) => {
    const {displayedSections} = action.payload;
    state.displayedSections = displayedSections;
    return state;
  },
  [TutorialActionTypes.ResetResponses]: (state: UserContextState, action: ResetResponses) => {
    const {questions} = action.payload;
    questions.map(uuid => {
      state.responses[uuid] = {};
    });
    return state;
  },
  [TutorialActionTypes.UpdateMeasurementFormValue]: (state: UserContextState, action: UpdateMeasurementFormValue) => {
    const {uuid, value} = action.payload;
    state.measuredFormValues[uuid] = value;
    return state;
  },
  [TutorialActionTypes.UpdateProductQuantities]: (state: UserContextState, action: UpdateProductQuantities) => {
    const {productQuantities} = action.payload;
    state.productQuantities = productQuantities;
    return state;
  },
  [TutorialActionTypes.UpdateDisplayedProducts]: (state: UserContextState, action: UpdateDisplayedProducts) => {
    const {displayedProducts} = action.payload;
    state.displayedProducts = displayedProducts;
    return state;
  },
  [TutorialActionTypes.UpdatePriceForProductRanges]: (state: UserContextState, action: UpdatePriceForProductRanges) => {
    const {productRangePrices} = action.payload;
    state.productRangePrices = productRangePrices;
    return state;
  },
  [TutorialActionTypes.UpdateCommonProductsTotalPrice]: (state: UserContextState, action: UpdateCommonProductsTotalPrice) => {
    const {commonProductsTotalPrice} = action.payload;
    state.commonProductsTotalPrice = commonProductsTotalPrice;
    return state;
  },
  [TutorialActionTypes.ResetUserContext]: (state: UserContextState, action: UpdateCommonProductsTotalPrice) => {

    const displayedSections = state.displayedSections.slice(0, 1);
    const instancesCountByMeasurementForm = {};
    const productQuantities = {};

    Object.keys(state.instancesCountByMeasurementForm).map(key => {
      instancesCountByMeasurementForm[key] = 1;
    });
    Object.keys(state.productQuantities).map(key => {
      productQuantities[key] = 0;
    });
    state = {
      ...initialUserContextState,
      displayedSections,
      instancesCountByMeasurementForm,
      productQuantities
    };

    return state;
  }

});