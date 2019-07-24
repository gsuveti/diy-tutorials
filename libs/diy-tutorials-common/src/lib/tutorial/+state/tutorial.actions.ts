import {Action, ActionCreator} from 'redux';
import {Response} from '../../models/response.model';
import {action} from 'typesafe-actions';

export enum TutorialActionTypes {
  AddResponse = '[Tutorial] Add response',
  ShowProducts = '[Tutorial] Show products',
  AddProductsToCart = '[Tutorial] Add products to cart',
  AddMeasurement = '[Tutorial] Add measurement',
  ChangeInstancesCount = '[Tutorial] ChangeInstancesCount',
}


export interface AddResponse extends Action<string> {
  type: typeof TutorialActionTypes.AddResponse
  payload: {
    answer: Response
  }
}

export const addResponse: ActionCreator<AddResponse> = (answer: Response) => action(
  TutorialActionTypes.AddResponse, {
    answer: answer
  });

export interface ChangeInstancesCount extends Action<string> {
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


export interface AddMeasurement extends Action<string> {
  type: typeof TutorialActionTypes.AddMeasurement
  payload: {
    uuid: string,
    instanceIndex: number,
    parentBlockUUID: string,
    value: string,
  }
}

export const addMeasurement: ActionCreator<AddMeasurement> =
  (uuid: string, parentBlockUUID: string, instanceIndex: number, value: string) => action(
    TutorialActionTypes.AddMeasurement, {
      uuid: uuid,
      parentBlockUUID: parentBlockUUID,
      instanceIndex: instanceIndex,
      value: value
    });


export interface ShowProducts extends Action<string> {
  type: typeof TutorialActionTypes.ShowProducts
  payload: {}
}

export const showProducts: ActionCreator<ShowProducts> = () => action(
  TutorialActionTypes.ShowProducts, {});


export interface AddProductsToCart extends Action<string> {
  type: typeof TutorialActionTypes.AddProductsToCart
  payload: {
    products: any
  }
}

export const addProductsToCart: ActionCreator<AddProductsToCart> = (products: any[]) => action(
  TutorialActionTypes.AddProductsToCart, {products});

export type TutorialActions = AddResponse | AddMeasurement | ChangeInstancesCount | ShowProducts | AddProductsToCart;
