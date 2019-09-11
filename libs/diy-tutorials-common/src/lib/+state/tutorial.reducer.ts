import {createReducer} from 'redux-starter-kit'
import {BlockAttributes} from '../models/block-attributes.model';
import {EnvironmentModel} from '../models/environment.model';


export interface TutorialState {
  uuid: string;
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
  environment: EnvironmentModel
}

export const initialTutorialState: TutorialState = {
  uuid: null,
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
  environment: {},
};

export const tutorialReducer = createReducer(initialTutorialState, {});
