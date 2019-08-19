import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddResponse, resetResponses, TutorialActionTypes} from './tutorial.actions';
import {filter, map} from 'rxjs/operators';
import {AppState} from '../../store';

export const resetResponsesEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.AddResponse),
    filter((action: AddResponse) => {
      const {answer} = action.payload;
      return answer.goToNextSection;
    }),
    map((action: AddResponse) => {
      const state = state$.value.tutorial;
      const {answer} = action.payload;
      const {questionUUID} = answer;

      const parentBlockUUID = state.questions.find(attributes => attributes.uuid === questionUUID).parentBlockUUID;
      const historyEnd = state.displayedSections.indexOf(parentBlockUUID) + 1;
      const history = state.displayedSections.slice(0, historyEnd);

      return state.questions
        .filter(question => history.indexOf(question.parentBlockUUID) < 0)
        .map(question => question.uuid);
    }),
    map(questions => resetResponses(questions))
  );
};