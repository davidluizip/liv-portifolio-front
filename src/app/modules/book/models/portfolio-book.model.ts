import { Data } from 'src/app/core/models/liv-response-protocol.model';
import { MediaModel } from './media.model';

export interface PortfolioBookModel {
  introducao: PortfolioBookIntrodutionModel;
  paginas: PagesModel;
  objetivo: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
export interface PortfolioBookIntrodutionModel {
  id: string;
  descricao: string;
}
export interface PagesModel {
  id: number;
  count: number;
  imagem: MediaModel;
  footer: MediaModel;
  aulas: ClassModel[];
}
export class ClassModel {
  id: number;
  titulo: string;
  subtitulo: string;
  cor: string;
  registro: boolean;
  descricao: string;
}

export interface ResumeRegisterModel {
  count: number;
  imagem: boolean;
  footer: boolean;
  pagina_aula_registro: boolean;
}
