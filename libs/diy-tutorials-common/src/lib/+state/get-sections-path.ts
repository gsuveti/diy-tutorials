import {TutorialState} from './tutorial.reducer';
import {SUBMIT_FORM} from '../constants';


export  function getSectionsPath(state: TutorialState, sectionUUID: string): string[] {
  if (!sectionUUID) {
    return [];
  }
  const sectionIndex = state.sections.findIndex(section => section.uuid === sectionUUID);
  const section = state.sections[sectionIndex];

  const isSectionWithoutRedirect = state.sectionsWithRedirect.indexOf(sectionUUID) < 0;

  if (isSectionWithoutRedirect && section.nextSection) {
    const nextSection = state.sections[sectionIndex + 1];
    const nextSectionUUID = (section.nextSection != SUBMIT_FORM ? section.nextSection : undefined) || ((nextSection && !nextSection.submitForm) ? nextSection.uuid : undefined);
    return [sectionUUID, ...getSectionsPath(state, nextSectionUUID)];
  } else {
    return [sectionUUID];
  }
}
