import { Formats } from 'src/app/core/models/media-formats.model';

export interface MediaModel {
  id: number;
  name: string;
  alternativeText: number;
  caption: string;
  width: number;
  height: number;
  formats: Formats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string;
  provider: string;
  provider_metadata: string;
  createdAt: Date;
  updatedAt: Date;
}
