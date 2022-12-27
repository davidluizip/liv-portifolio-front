import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, take, tap } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { ApiGatewayService } from 'src/app/core/services/api/api-gateway.service';
import { ETypesComponentStrapi } from 'src/app/shared/enum/types-component-strapi.enum';
import { filterResponse } from 'src/app/shared/rxjs/custom-operators';
import { MediaModel } from '../../models/media.model';
import { PortfolioBookModel } from '../../models/portfolio-book.model';
import {
  SaveClassPageDescription,
  TeacherBookModel
} from '../../models/teacher-book.model';

@Injectable({
  providedIn: 'root'
})
export class LessonTrackService {
  constructor(private apiGatewayService: ApiGatewayService) {}
  getTrailActivities(
    idPage: number = 1,
    populate: ETypesComponentStrapi[] = [
      ETypesComponentStrapi.paginas_aulas,
      ETypesComponentStrapi.paginas_footer,
      ETypesComponentStrapi.paginas_imagem
    ]
  ): Observable<Model<PortfolioBookModel>> {
    let params = new HttpParams();
    if (populate.length > 0) {
      const filters = populate.join(',');
      console.log(populate, filters);
      params = params.set('populate', filters);
    }

    return this.apiGatewayService
      .get<PortfolioBookModel>(`/livro-portifolio/next-page/${idPage}`, {
        params
      })
      .pipe(map(res => res.data));
  }
}
