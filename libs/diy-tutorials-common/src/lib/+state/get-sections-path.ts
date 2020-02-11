import {TutorialState} from './tutorial.reducer';
import {SUBMIT_FORM} from '../constants';


export  function getSectionsPath(state: TutorialState, sectionUUID: string): string[] {
  if (!sectionUUID) {
    return [];
  }
  const sectionIndex = state.sections.findIndex(section => section.uuid === sectionUUID);
  const section = state.sections[sectionIndex];

  const isSectionWithoutRedirect = state.sectionsWithRedirect.indexOf(sectionUUID) < 0;

  if (isSectionWithoutRedirect) {

    let nextSectionUUID = undefined;
    if(section.nextSection != SUBMIT_FORM){
      if(section.nextSection){
          nextSectionUUID = section.nextSection;
      }else{
        const nextSection = state.sections[sectionIndex + 1];
        if(nextSection){
          nextSectionUUID = nextSection.uuid;
        }
      }
    }

    return [sectionUUID, ...getSectionsPath(state, nextSectionUUID)];
  } else {
    return [sectionUUID];
  }
}
