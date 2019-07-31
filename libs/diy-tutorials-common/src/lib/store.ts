import {AnyAction, applyMiddleware, compose, createStore, Store} from 'redux';
import thunk from 'redux-thunk';
import {reducers} from "./reducers";
import {createEpicMiddleware} from 'redux-observable';
import {initialTutorialState, TutorialState} from './tutorial/+state/tutorial.reducer';


export interface AppState {
  tutorial: TutorialState;
}

const epicMiddleware = createEpicMiddleware();
const devMiddlewares = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION__) ? [(window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()] : [];

export function configureStore(initialState: AppState = {
  tutorial: initialTutorialState
}): Store<AppState, AnyAction> {
  return createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(thunk, epicMiddleware),
      ...devMiddlewares
    )
  );
}


