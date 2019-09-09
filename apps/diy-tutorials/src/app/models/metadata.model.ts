import {OpenGraphModel} from './open-graph.model';
import {GeneralMetadataModel} from './general-metadata.model';
import {SchemaOrgItemModel} from './schema-org-item.model';

export interface MetadataModel {
  general: GeneralMetadataModel;
  openGraph: OpenGraphModel;
  schemaOrg: {
    items: SchemaOrgItemModel[]
  }
}
