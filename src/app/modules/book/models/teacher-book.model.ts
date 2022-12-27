import {
  Data,
  DataArray,
  DataPut,
} from 'src/app/core/models/liv-response-protocol.model';
import { MediaModel } from './media.model';
import { TeacherModel } from './teacher.model';

export interface TeacherBookModel {
  turma: string;
  serie: string;
  escola: string;
  pagina_turma?: ClassPage;
  registros?: Register;
  professor?: Data<TeacherModel>;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

export type SaveClassPageDescription = DataPut<{
  pagina_turma: Pick<ClassPage, 'descricao'>;
}>;

export type SaveRegisterPageDescription = DataPut<{
  registros: {
    alternativeText: number;
    descricao: string;
    nome: string;
  };
}>;

export interface ClassPage {
  id: number;
  descricao: string;
  midia: Data<MediaModel>;
}

export interface Register {
  id: number;
  alternativeText: number;
  midia?: DataArray<MediaModel>;
  descricao: string;
  nome: string;
}
