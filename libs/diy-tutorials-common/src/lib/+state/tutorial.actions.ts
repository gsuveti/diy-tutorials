import {Action, ActionCreator, AnyAction} from 'redux';
import {Response} from '../models/response.model';
import {action, createAction} from 'typesafe-actions';
import * as firebase from 'firebase/app';

export enum TutorialActionTypes {
  AddResponse = '[Tutorial] Add response',
  ShowProducts = '[Tutorial] Show products',
  HideProducts = '[Tutorial] Hide products',
  AddProductsToCart = '[Tutorial] Add products to cart',
  SelectProductRange = '[Tutorial] Select product range',
  SelectProduct = '[Tutorial] Select product',
  RemoveProduct = '[Tutorial] Remove product',
  AddMeasurement = '[Tutorial] Add measurement',
  ChangeInstancesCount = '[Tutorial] Change Instances Count',
  GetUserData = '[Tutorial] Get user data',
  UserDataFetched = '[Tutorial] User Data Fetched',
  UserDataSaved = '[Tutorial] User Data Saved',
  UpdateDisplayedProductTypes = '[Tutorial] Update Displayed Product Types',
  UpdateDisplayedProducts = '[Tutorial] Update Displayed Products',
  UpdateDisplayedSections = '[Tutorial] Update Displayed Sections',
  ResetResponses = '[Tutorial] Reset Responses',
  UpdateMeasurementFormValue = '[Tutorial] Update Measurement Form Value',
  UpdateProductQuantities = '[Tutorial] Update Product Quantities',
  LoginWithGoogle = '[Tutorial] Login With Google',
  LoginWithFacebook = '[Tutorial] Login With Facebook',
  UpdatePriceForProductRanges = '[Tutorial] Update price for product ranges',
  UpdateCommonProductsTotalPrice = '[Tutorial] Update common products total price',
  SendEmailWithInstructions = '[Tutorial] Send email with instructions',
  Logout = '[Tutorial] Logout',
  ShowProductsOrScrollToMeasurements = '[Tutorial] Show products or scroll to measurements',
  ResetUserContext = '[Tutorial] Reset user context',
  EmailSent = '[Tutorial] Email sent',
  EmailNotSent = '[Tutorial] Email not sent',
}


export interface AddResponse extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.AddResponse
  payload: {
    answer: Response
  }
}

export const addResponse: ActionCreator<AddResponse> = (answer: Response) => action(
  TutorialActionTypes.AddResponse, {
    answer: answer
  });

export interface ChangeInstancesCount extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.ChangeInstancesCount
  payload: {
    uuid: string,
    count: number
  }
}

export const changeInstancesCount: ActionCreator<ChangeInstancesCount> = (uuid: string, count: number) => action(
  TutorialActionTypes.ChangeInstancesCount, {
    uuid: uuid,
    count: count,
  });


export interface AddMeasurement extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.AddMeasurement
  payload: {
    uuid: string,
    instanceIndex: number,
    parentBlockUUID: string,
    value: number,
  }
}

export const addMeasurement: ActionCreator<AddMeasurement> =
  (uuid: string, parentBlockUUID: string, instanceIndex: number, value: number) => action(
    TutorialActionTypes.AddMeasurement, {
      uuid: uuid,
      parentBlockUUID: parentBlockUUID,
      instanceIndex: instanceIndex,
      value: value
    });


export interface ShowProducts extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.ShowProducts
  payload: {}
}

export const showProducts: ActionCreator<ShowProducts> = () => action(
  TutorialActionTypes.ShowProducts, {});


export interface HideProducts extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.HideProducts
  payload: {}
}

export const hideProducts: ActionCreator<HideProducts> = () => action(
  TutorialActionTypes.HideProducts, {});


export interface AddProductsToCart extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.AddProductsToCart
  payload: {
    products: any
  }
}

export const addProductsToCart: ActionCreator<AddProductsToCart> = (products: any[]) => action(
  TutorialActionTypes.AddProductsToCart, {products});


export interface SelectProduct extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.SelectProduct
  payload: {
    productUUID: string
  }
}

export const selectProduct: ActionCreator<SelectProduct> = createAction(
  TutorialActionTypes.SelectProduct, action => {
    return (productUUID: string) => action({productUUID});
  });


export interface RemoveProduct extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.RemoveProduct
  payload: {
    productUUID: string
  }
}

export const removeProduct: ActionCreator<RemoveProduct> = (productUUID: string) => action(
  TutorialActionTypes.RemoveProduct, {productUUID});


export interface SelectProductRange extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.SelectProductRange
  payload: {
    productRangeUUID: string
  }
}

export const selectProductRange: ActionCreator<SelectProductRange> = (productRangeUUID: string) => action(
  TutorialActionTypes.SelectProductRange, {productRangeUUID});


export interface GetUserData extends Action<string> {
  type: typeof TutorialActionTypes.GetUserData
  payload: { user: firebase.User }
}

export const getUserData: ActionCreator<GetUserData> = (user: firebase.User) => action(
  TutorialActionTypes.GetUserData, {
    user
  });

export interface UserDataFetched extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.UserDataFetched
  payload: { data: any }
}

export const userDataFetched: ActionCreator<UserDataFetched> = (data: any) => action(
  TutorialActionTypes.UserDataFetched, {data});


export interface UserDataSaved extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.UserDataSaved
  payload: {}
}

export const userDataSaved: ActionCreator<UserDataSaved> = () => action(
  TutorialActionTypes.UserDataSaved, {});


export interface UpdateDisplayedSections extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.UpdateDisplayedSections
  payload: {
    displayedSections: string[]
  }
}

export const updateDisplayedSections: ActionCreator<UpdateDisplayedSections> = (displayedSections: string[]) => action(
  TutorialActionTypes.UpdateDisplayedSections, {displayedSections});


export interface UpdateDisplayedProductTypes extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.UpdateDisplayedProductTypes
  payload: {
    displayedProductTypes: { [uuid: string]: boolean }
  }
}

export const updateDisplayedProductTypes: ActionCreator<UpdateDisplayedProductTypes> = (displayedProductTypes: { [uuid: string]: boolean }) => action(
  TutorialActionTypes.UpdateDisplayedProductTypes, {displayedProductTypes});


export interface UpdateDisplayedProducts extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.UpdateDisplayedProducts
  payload: {
    displayedProducts: { [uuid: string]: boolean }
  }
}

export const updateDisplayedProducts: ActionCreator<UpdateDisplayedProducts> = (displayedProducts: { [uuid: string]: boolean }) => action(
  TutorialActionTypes.UpdateDisplayedProducts, {displayedProducts});


export interface ResetResponses extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.ResetResponses
  payload: {
    questions: string[]
  }
}

export const resetResponses: ActionCreator<ResetResponses> = (questions: string[]) => action(
  TutorialActionTypes.ResetResponses, {questions});


export interface UpdateMeasurementFormValue extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.UpdateMeasurementFormValue
  payload: {
    value: number,
    uuid: string,
  }
}

export const updateMeasurementFormValue: ActionCreator<UpdateMeasurementFormValue> = (uuid: string, value: number) => action(
  TutorialActionTypes.UpdateMeasurementFormValue, {uuid, value});


export interface UpdateProductQuantities extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.UpdateProductQuantities
  payload: {
    productQuantities: { [uuid: string]: number },
  }
}

export const updateProductQuantities: ActionCreator<UpdateProductQuantities> = (productQuantities: { [uuid: string]: number }) => action(
  TutorialActionTypes.UpdateProductQuantities, {productQuantities});


export interface UpdatePriceForProductRanges extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.UpdatePriceForProductRanges
  payload: {
    productRangePrices: { [uuid: string]: number },
  }
}

export const updatePriceForProductRanges: ActionCreator<UpdatePriceForProductRanges> = (productRangePrices: { [uuid: string]: number }) => action(
  TutorialActionTypes.UpdatePriceForProductRanges, {productRangePrices});


export interface UpdateCommonProductsTotalPrice extends AnyAction, Action<string> {
  type: typeof TutorialActionTypes.UpdateCommonProductsTotalPrice
  payload: {
    commonProductsTotalPrice: number,
  }
}

export const updateCommonProductsTotalPrice: ActionCreator<UpdateCommonProductsTotalPrice> = (commonProductsTotalPrice: number) => action(
  TutorialActionTypes.UpdateCommonProductsTotalPrice, {commonProductsTotalPrice});


export const loginWithGoogle: ActionCreator<Action> = () => action(
  TutorialActionTypes.LoginWithGoogle, {});

export const loginWithFacebook: ActionCreator<Action> = () => action(
  TutorialActionTypes.LoginWithFacebook, {});

export const sendEmailWithInstructions: ActionCreator<Action> = () => action(
  TutorialActionTypes.SendEmailWithInstructions, {});

export const logout: ActionCreator<Action> = () => action(
  TutorialActionTypes.Logout, {});

export const showProductsOrScrollToMeasurements: ActionCreator<Action> = () => action(
  TutorialActionTypes.ShowProductsOrScrollToMeasurements, {});

export const resetUserContext: ActionCreator<Action> = () => action(
  TutorialActionTypes.ResetUserContext, {});


export type TutorialActions = AddResponse | AddMeasurement
  | ChangeInstancesCount | ShowProducts | AddProductsToCart | SelectProductRange
  | SelectProduct | RemoveProduct | UpdateDisplayedProductTypes
  | Action<TutorialActionTypes.LoginWithGoogle> | Action<TutorialActionTypes.LoginWithFacebook>
  | Action<TutorialActionTypes.Logout>
  | Action<TutorialActionTypes.ResetUserContext>
  | Action<TutorialActionTypes.SendEmailWithInstructions>;
