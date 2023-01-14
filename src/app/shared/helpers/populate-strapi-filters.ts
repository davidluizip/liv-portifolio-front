import { HttpParams } from '@angular/common/http';
import { ETypesComponentStrapi } from '../enum/types-component-strapi.enum';

export function populateStrapiFilters(
  populate: ETypesComponentStrapi[] = []
): HttpParams {
  let params = new HttpParams();
  if (populate.length > 0) {
    const filters = populate.join(',');
    params = params.set('populate', filters);
  }

  return params;
}
