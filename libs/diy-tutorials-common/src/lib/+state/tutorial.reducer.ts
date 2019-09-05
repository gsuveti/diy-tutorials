import {createReducer} from 'redux-starter-kit'
import {BlockAttributes} from '../models/block-attributes.model';


export interface TutorialState {
  blocks: BlockAttributes[];
  sections: BlockAttributes[],
  sectionsWithRedirect: string[],
  questions: BlockAttributes[],
  measurements: BlockAttributes[],
  measurementForms: BlockAttributes[],
  measurementFormsOrder: string[],
  products: BlockAttributes[],
  optionalProducts: BlockAttributes[],
  commonProducts: BlockAttributes[],
  productRanges: BlockAttributes[],

  questionOptions: { [uuid: string]: any };
  displayedConditions: { [uuid: string]: any };


}

export const initialTutorialState: TutorialState = {
  blocks: [],
  sections: [],
  sectionsWithRedirect: [],
  questions: [],
  measurements: [],
  measurementForms: [],
  measurementFormsOrder: [],
  productRanges: [],
  products: [],
  optionalProducts: [],
  commonProducts: [],
  questionOptions: {},
  displayedConditions: {},
};

export const tutorialReducer = createReducer(initialTutorialState, {});
