import { Data, Model } from 'src/app/core/models/liv-response-protocol.model';
import { PhotoModel } from './photo.model';
import { TeacherModel } from './teacher.model';

export interface TeacherBookModel {
  turma: string;
  serie: string;
  escola: string;
  pagina_turma: PaginaTurma;
  registros: Registros;
  professor: Data<TeacherModel>;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

interface PaginaTurma {
  id: number;
  descricao: string;
  midia: Data<PhotoModel>;
}

interface Registros {
  id: number;
  midia: Data<Model<PhotoModel>[]>;
}
