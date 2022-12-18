import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { TeacherModel } from './teacher.model';

export interface TeacherBookModel {
  turma: string;
  serie: string;
  escola: string;
  pagina_turma: PaginaTurma;
  registros: Registros;
  professor: Model<TeacherModel>;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

interface PaginaTurma {
  id: number;
  descricao: string;
}

interface Registros {
  id: number;
  objetivo_atividade: string;
}
