import {Action, ActionCreator, AnyAction} from 'redux';
import {Response} from '../../models/response.model';
import {action, createAction} from 'typesafe-actions';

export enum TutorialActionTypes {
  AddResponse = '[Tutorial] Add response',
  ShowProducts = '[Tutorial] Show products',
  AddProductsToCart = '[Tutorial] Add products to cart',
  SelectProductRange = '[Tutorial] Select product range',
  SelectProduct = '[Tutorial] Select product',
  RemoveProduct = '[Tutorial] Remove product',
  AddMeasurement = '[Tutorial] Add measurement',
  ChangeInstancesCount = '[Tutorial] ChangeInstancesCount',
  GetUserData = '[Tutorial] Get user data',
  UserDataFetched = '[Tutorial] UserDataFetched',
  UserDataSaved = '[Tutorial] UserDataSaved',
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


export interface GetUserData extends  Action<string> {
  type: typeof TutorialActionTypes.GetUserData
  payload: { userUID: string }
}

export const getUserData: ActionCreator<GetUserData> = (userUID: string) => action(
  TutorialActionTypes.GetUserData, {
    userUID
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


export type TutorialActions = AddResponse | AddMeasurement
  | ChangeInstancesCount | ShowProducts | AddProductsToCart | SelectProductRange | SelectProduct | RemoveProduct;
