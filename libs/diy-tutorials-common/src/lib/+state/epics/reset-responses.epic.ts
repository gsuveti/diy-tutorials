import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddResponse, resetResponses, TutorialActionTypes} from '../tutorial.actions';
import {filter, map} from 'rxjs/operators';
import {AppState} from '../app.state';

export const resetResponsesEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.AddResponse),
    filter((action: AddResponse) => {
      const {answer} = action.payload;
      return answer.goToNextSection;
    }),
    map((action: AddResponse) => {
      const state = state$.value;
      const tutorialState = state.tutorial;
      const userContextState = state.userContext;

      const {answer} = action.payload;
      const {questionUUID} = answer;

      const parentBlockUUID = tutorialState.questions.find(attributes => attributes.uuid === questionUUID).parentBlockUUID;
      const historyEnd = userContextState.displayedSections.indexOf(parentBlockUUID) + 1;
      const history = userContextState.displayedSections.slice(0, historyEnd);

      return tutorialState.questions
        .filter(question => history.indexOf(question.parentBlockUUID) < 0)
        .map(question => question.uuid);
    }),
    map(questions => resetResponses(questions))
  );
};
