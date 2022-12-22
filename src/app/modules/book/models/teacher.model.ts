import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { MediaModel } from './media.model';
import { SeriesModel } from './series.model';

export interface TeacherModel {
  apelido: string;
  descricao: string;
  etapa: number;
  series: SeriesModel[];
  foto: Model<MediaModel>;
  createdAt: Date;
  updatedAt: Date;
}
