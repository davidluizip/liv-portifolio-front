import { Model } from './liv-response-protocol.model';
import { PhotoModel } from './photo.model';
import { SeriesModel } from './series.model';

export interface TeacherModel {
  apelido: string;
  descricao: string;
  etapa: number;
  series: SeriesModel[];
  foto: Model<PhotoModel>;
  createdAt: Date;
  updatedAt: Date;
}
