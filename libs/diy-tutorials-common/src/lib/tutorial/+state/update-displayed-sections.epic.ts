import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddResponse, TutorialActionTypes, updateDisplayedSections} from './tutorial.actions';
import {filter, map} from 'rxjs/operators';
import {AppState} from '../../store';
import {TutorialState} from './tutorial.reducer';
import {SUBMIT_FORM} from '../../constants';

export const updateDisplayedSectionsEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
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

      const nextSection = answer.nextSection;
      return [...history, ...getSectionsPath(state, nextSection)];
    }),
    map(displayedSections => updateDisplayedSections(displayedSections))
  );
};


function getSectionsPath(state: TutorialState, sectionUUID: string): string[] {
  if (!sectionUUID) {
    return [];
  }
  if (state.sectionsWithRedirect.indexOf(sectionUUID) < 0) {
    const sectionIndex = state.sections.findIndex(section => section.uuid === sectionUUID);
    const section = state.sections[sectionIndex];
    const nextSection = state.sections[sectionIndex + 1];
    const nextSectionUUID = (section.nextSection != SUBMIT_FORM ? section.nextSection : undefined) || ((nextSection && !nextSection.submitForm) ? nextSection.uuid : undefined);
    return [sectionUUID, ...getSectionsPath(state, nextSectionUUID)];
  } else {
    return [sectionUUID];
  }
}
