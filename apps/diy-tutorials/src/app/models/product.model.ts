import {MetadataModel} from './metadata.model';

export interface ProductModel {
  url?: string;
  id?: string;
  metadata?: MetadataModel;
}
