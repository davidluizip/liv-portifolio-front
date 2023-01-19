import {
  Data,
  DataArray,
  DataPut
} from 'src/app/core/models/liv-response-protocol.model';
import { MediaModel } from './media.model';
import { SerieModel } from './serie.model';
import { TeacherModel } from './teacher.model';

export interface TeacherBookModel {
  turma: string;
  serie: SerieModel;
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
    texto: {
      alternativeText: number;
      descricao: string;
      nome: string;
      index_page: number;
    };
  };
}>;

export interface ClassPage {
  id: number;
  descricao: string;
  midia: Data<MediaModel>;
}

export interface RegisterText {
  id: number;
  alternativeText: number;
  descricao: string;
  nome: string;
}

export interface Register {
  id: number;
  midia?: DataArray<MediaModel>;
  texto?: RegisterText[];
}
