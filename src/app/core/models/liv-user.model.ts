interface LivUserProfiles {
  id: number;
  nome: string;
  tipoPerfilLiv: number;
}

interface LivUserGradeModel {
  id: number;
  nome: string;
}

interface LivUserSegmentsModel {
  id: number;
  nome: string;
  anos: LivUserGradeModel[];
  titulo: string;
  id_interno: number;
}

export interface LivUserModel {
  anos: [];
  cpf: string;
  email: string;
  espacoSer: boolean;
  id: number;
  nome: string;
  perfisAcesso: LivUserProfiles[];
  segmentos_strapi: LivUserSegmentsModel[];
  token: string;
}
