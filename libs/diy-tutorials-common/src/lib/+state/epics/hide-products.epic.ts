import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddResponse, hideProducts, TutorialActionTypes} from '../tutorial.actions';
import {filter, map} from 'rxjs/operators';
import {AppState} from '../../store';

export const hideProductsEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.AddResponse),
    filter((action: AddResponse) => {
      const {answer} = action.payload;
      return answer.goToNextSection;
    }),
    map(questions => hideProducts(questions))
  );
};
