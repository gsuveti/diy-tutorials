import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddResponse, TutorialActionTypes, updateDisplayedSections} from '../tutorial.actions';
import {filter, map} from 'rxjs/operators';
import {AppState} from '../app.state';
import {getSectionsPath} from '../get-sections-path';

export const updateDisplayedSectionsEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
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

      const {questions} = tutorialState;
      const {displayedSections} = userContextState;

      const parentBlockUUID = questions.find(attributes => attributes.uuid === questionUUID).parentBlockUUID;
      const historyEnd = displayedSections.indexOf(parentBlockUUID) + 1;
      const history = displayedSections.slice(0, historyEnd);

      const nextSection = answer.nextSection;
      return [...history, ...getSectionsPath(tutorialState, nextSection)];
    }),
    map(displayedSections => updateDisplayedSections(displayedSections))
  );
};
