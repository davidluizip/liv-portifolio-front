import { Data } from 'src/app/core/models/liv-portfolio-response-protocol.model';
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
  titulo_registro: string;
  subtitulo_registro: string;
  objetivo_registro: string;
}

export interface ResumeRegisterModel {
  count: number;
  paginas: PagesResumeModel[];
}
export interface PagesResumeModel {
  id: number;
  imagem: boolean;
  footer: boolean;
  pagina_aula_registro: boolean;
}
