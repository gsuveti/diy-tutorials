import {Action, ActionCreator} from 'redux';
import {Answer} from '../../models/answer.model';
import {action} from 'typesafe-actions';

export enum TutorialActionTypes {
  AddAnswer = '[Tutorial] Add answer',
  AddMeasurement = '[Tutorial] Add measurement',
  ChangeInstancesCount = '[Tutorial] ChangeInstancesCount',
}


export interface AddAnswer extends Action<string> {
  type: typeof TutorialActionTypes.AddAnswer
  payload: {
    answer: Answer
  }
}

export const addAnswer: ActionCreator<AddAnswer> = (answer: Answer) => action(
  TutorialActionTypes.AddAnswer, {
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


export type TutorialActions = AddAnswer | AddMeasurement | ChangeInstancesCount;
