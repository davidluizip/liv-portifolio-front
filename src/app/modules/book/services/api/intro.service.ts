import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Model } from 'src/app/core/models/liv-portfolio-response-protocol.model';
import { ApiGatewayService } from 'src/app/core/services/api/api-gateway.service';
import { ETypesComponentStrapi } from 'src/app/shared/enum/types-component-strapi.enum';
import { PortfolioBookModel } from '../../models/portfolio-book.model';

@Injectable({
  providedIn: 'root'
})
export class IntroService {
  constructor(private _apiGatewayService: ApiGatewayService) {}

  get(
    externalIdStrapi: number,
    typeComponent = ETypesComponentStrapi.intro
  ): Observable<Model<PortfolioBookModel>> {
    const params = new HttpParams().set('populate', typeComponent);

    return this._apiGatewayService
      .get<PortfolioBookModel>(
        `/portifolios/introduction/${externalIdStrapi}`,
        { params }
      )
      .pipe(map((res) => res.data));
  }
}
