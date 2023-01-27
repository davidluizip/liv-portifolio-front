import { writeFile } from 'fs';
// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.prod.ts';
// Load node modules
const colors = require('colors');
require('dotenv').config();
// `environment.ts` file structure
const envConfigFile = `export const environment = {
  production: true,
  stage: 'production'
  cypher_secret: '702c803d4654c95fad85035aa82b4648',
  baseUserStrapi: 'https://strapi-ci-e4be4tejsa-uc.a.run.app/api/',
  apiPortfolio: 'https://strapi-ci-e4be4tejsa-uc.a.run.app/api/',
  tokenStrapi: '659dcdcff121d9c1001cff46a0d15dc2f77d951a64c65637f998984091e432fa555673c965f51fe0439e446570498bfb497cd6fd6694032678e3731627da154ef88c5bd40594e88ca0785eb585fc9f7572179b39aee06771c67171868b37d625789fb106eaa963d3d3bc2faeda154b372a9a78590f096e8e46f9fcea84ad55be',
  apiLiv: "https://api.inteligenciadevida.com.br/api"
};
`;
console.log(
  colors.magenta(
    'The file `environment.prod.ts` will be written with the following content: \n'
  )
);
console.log(colors.grey(envConfigFile));
writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(
      colors.magenta(
        `Angular environment.ts file generated correctly at ${targetPath} \n`
      )
    );
  }
});
