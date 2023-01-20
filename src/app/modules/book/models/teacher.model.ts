import { Model } from 'src/app/core/models/liv-portfolio-response-protocol.model';
import { MediaModel } from './media.model';
import { SerieModel } from './serie.model';

export interface TeacherModel {
  apelido: string;
  descricao: string;
  etapa: number;
  series: SerieModel[];
  foto: Model<MediaModel>;
  createdAt: Date;
  updatedAt: Date;
}
