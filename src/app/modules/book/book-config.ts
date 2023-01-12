import { SerieEnum } from './enums/serie.enum';

export default {
  [SerieEnum.fundamental_1_ano]: {
    mascot: {
      src: 'assets/images/mascots/1-ano.png',
      alt: 'Imagem do mascote do 1º ano',
    },
    colors: {
      brand: '#4F89C8',
      brand_light: '#B9D0E9',
      primary: '#4E2F92',
      secondary: '#FF7C39',
      tertiary: '#FFDECD',
    },
  },
  [SerieEnum.fundamental_2_ano]: {
    mascot: {
      src: 'assets/images/mascots/2-ano.png',
      alt: 'Imagem do mascote do 2º ano',
    },
    colors: {
      brand: '#FF7C39',
      brand_light: '#FFBB9C',
      primary: '#4E2F92',
      secondary: '#F7D2E1',
      tertiary: '#F6F4F9',
    },
  },
  [SerieEnum.fundamental_3_ano]: {
    mascot: {
      src: 'assets/images/mascots/3-ano.png',
      alt: 'Imagem do mascote do 3º ano',
    },
    colors: {
      brand: '#7159A8',
      brand_light: '#DCD5E9',
      primary: '#E04A88',
      secondary: '#E04A88',
      tertiary: '#F6F4F9',
    },
  },
  [SerieEnum.infantil_3_anos]: {
    mascot: {
      src: 'assets/images/mascots/3-anos.png',
      alt: 'Imagem do mascote do 3 anos',
    },
    colors: {
      brand: '#72A1D3',
      brand_light: '#B9D0E9',
      primary: '#B8ACD3',
      secondary: '#FFBE12',
      tertiary: '#FFDECD',
    },
  },
  [SerieEnum.infantil_4_anos]: {
    mascot: {
      src: 'assets/images/mascots/4-anos.png',
      alt: 'Imagem do mascote do 4 anos',
    },
    colors: {
      brand: '#FFBE12',
      brand_light: '#FFD871',
      primary: '#FFD871',
      secondary: '#FF7C39',
      tertiary: '#FFDECD',
    },
  },
  [SerieEnum.infantil_5_anos]: {
    mascot: {
      src: 'assets/images/mascots/5-anos.png',
      alt: 'Imagem do mascote do 5 anos',
    },
    colors: {
      brand: '#E04A88',
      brand_light: '#EFA5C3',
      primary: '#B8ACD3',
      secondary: '#B8ACD3',
      tertiary: '#F6F4F9',
    },
  },
} as const;
