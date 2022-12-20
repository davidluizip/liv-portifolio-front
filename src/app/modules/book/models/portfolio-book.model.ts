export interface PortfolioBookModel {
  introducao: PortfolioBookIntrodutionModel;
  objetivo: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
export interface PortfolioBookIntrodutionModel {
  id: string;
  descricao: string;
}
