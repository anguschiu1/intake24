import { ImageMapAttributes, ImageMapObjectAttributes, Pagination } from '../../models';
import { UploadSourceImageInput } from './source-images';

export type ImageMapEntryObject = Pick<
  ImageMapObjectAttributes,
  'id' | 'description' | 'outlineCoordinates'
>;

export type ImageMapInputObjects = ImageMapEntryObject[];

export interface CreateImageMapInput extends UploadSourceImageInput {
  description: string;
}

export type UpdateImageMapInput = {
  description: string;
  objects: ImageMapEntryObject[];
};

export interface ImageMapListEntry extends Pick<ImageMapAttributes, 'id' | 'description'> {
  imageUrl: string;
}

export type ImageMapsResponse = Pagination<ImageMapListEntry>;

export type ImageMapEntry = {
  id: string;
  description: string;
  baseImageUrl: string;
  objects: ImageMapEntryObject[];
};
