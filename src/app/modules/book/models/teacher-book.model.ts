import {
  Data,
  DataArray,
} from 'src/app/core/models/liv-response-protocol.model';
import { MediaModel } from './media.model';
import { TeacherModel } from './teacher.model';

export interface TeacherBookModel {
  turma: string;
  serie: string;
  escola: string;
  pagina_turma?: PaginaTurma;
  registros?: Registros;
  professor?: Data<TeacherModel>;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

interface PaginaTurma {
  id: number;
  descricao: string;
  midia: Data<MediaModel>;
}

interface Registros {
  id: number;
  midia: DataArray<MediaModel>;
}
