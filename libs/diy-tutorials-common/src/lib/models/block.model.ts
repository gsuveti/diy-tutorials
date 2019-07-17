import {BlockAttributes} from './block-attributes.model';

export interface Block {
  attributes?: BlockAttributes;
  html?: string;
  innerBlocks?: Block[];
  key: string;
}
