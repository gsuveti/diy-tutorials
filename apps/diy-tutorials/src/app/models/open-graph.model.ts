export interface OpenGraphModel {
  description: string;
  title: string;
  type: string;
  url: string;
  site_name: string;
  image: ImageModel | ImageModel[];
}

export interface ImageModel {
  height: number;
  width: number;
  url: string;
}
