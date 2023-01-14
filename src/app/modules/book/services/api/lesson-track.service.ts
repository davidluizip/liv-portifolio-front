import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { ApiGatewayService } from 'src/app/core/services/api/api-gateway.service';
import { ETypesComponentStrapi } from 'src/app/shared/enum/types-component-strapi.enum';
import { populateStrapiFilters } from 'src/app/shared/helpers/populate-strapi-filters';

import {
  PortfolioBookModel,
  ResumeRegisterModel
} from '../../models/portfolio-book.model';

@Injectable({
  providedIn: 'root'
})
export class LessonTrackService {
  constructor(private apiGatewayService: ApiGatewayService) {}

  getTrailActivities(
    externalStrapiId: number,
    pageId: number,
    populate: ETypesComponentStrapi[] = [
      ETypesComponentStrapi.paginas_aulas,
      ETypesComponentStrapi.paginas_footer,
      ETypesComponentStrapi.paginas_imagem
    ]
  ): Observable<Model<PortfolioBookModel>> {
    const params = populateStrapiFilters(populate);

    return this.apiGatewayService
      .get<PortfolioBookModel>(
        `/portifolios/next-page/${externalStrapiId}/${pageId}`,
        {
          params
        }
      )
      .pipe(map(res => res.data));
  }

  getResumeRegister(
    externalIdStrapi: number,
    populate: ETypesComponentStrapi[] = [
      ETypesComponentStrapi.paginas_aulas,
      ETypesComponentStrapi.paginas_footer,
      ETypesComponentStrapi.paginas_imagem
    ]
  ): Observable<Model<ResumeRegisterModel>> {
    const params = populateStrapiFilters(populate);

    return this.apiGatewayService
      .get<ResumeRegisterModel>(
        `/portifolios/register/summary/${externalIdStrapi}`,
        {
          params
        }
      )
      .pipe(map(res => res.data));
  }
}
