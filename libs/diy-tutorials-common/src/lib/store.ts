import {AnyAction, applyMiddleware, compose, createStore, Store} from 'redux';
import {reducers} from "./reducers";
import {combineEpics, createEpicMiddleware, ofType, StateObservable} from 'redux-observable';
import {initialTutorialState, TutorialState} from './tutorial/+state/tutorial.reducer';
import {GetUserData, TutorialActionTypes, userDataFetched, userDataSaved} from './tutorial/+state/tutorial.actions';
import {from, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import * as firebase from 'firebase';


export interface AppState {
  tutorial: TutorialState;
  firestore?: any;
}

const epicMiddleware = createEpicMiddleware();
const devMiddlewares = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION__) ? [(window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()] : [];


const getUserDataEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.GetUserData),
    mergeMap((action: GetUserData) => {
      const {userUID} = action.payload;
      return from(firebase.firestore().collection(`responses`).doc(userUID).get());
    }),
    map(document => userDataFetched(document.data()))
  );
};

const saveUserDataEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(
      TutorialActionTypes.AddResponse,
      TutorialActionTypes.AddMeasurement,
      TutorialActionTypes.ShowProducts,
      TutorialActionTypes.SelectProduct,
      TutorialActionTypes.RemoveProduct,
      TutorialActionTypes.SelectProductRange,
      TutorialActionTypes.ChangeInstancesCount,
    ),
    mergeMap(action => {
      const tutorialState = state$.value.tutorial;
      const {userUID, responses, measuredValues, measuredFormValues, instancesCountByMeasurementForm, showProducts, selectedProducts, selectedProductRange} = tutorialState;
      const data = {
        responses,
        measuredValues,
        measuredFormValues,
        instancesCountByMeasurementForm,
        showProducts,
        selectedProducts,
        selectedProductRange
      };
      return from(firebase.firestore().collection(`responses`).doc(userUID).set(data));
    }),
    map(() => userDataSaved())
  );
};

export const rootEpic = combineEpics(
  getUserDataEpic,
  saveUserDataEpic
);

export function configureStore(initialState: AppState = {
  tutorial: initialTutorialState
}): Store<AppState, AnyAction> {
  const store = createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(epicMiddleware),
      ...devMiddlewares
    )
  );
  // @ts-ignore
  epicMiddleware.run(rootEpic);
  return store;
}


