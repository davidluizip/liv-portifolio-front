import { HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { ApiGatewayService } from 'src/app/core/services/api/api-gateway.service';
import { ETypesComponentStrapi } from 'src/app/shared/enum/types-component-strapi.enum';
import { MediaModel } from '../../models/media.model';
import { TeacherBookModel } from '../../models/teacher-book.model';

@Injectable({
  providedIn: 'root',
})
export class CoverFrontService {
  constructor(private apiGatewayService: ApiGatewayService) {}

  /** Para controller no response sobre os componentes que devem retornar */

  uploadPhoto(data: FormData): Observable<HttpEvent<MediaModel>> {
    return this.apiGatewayService.upload<MediaModel>('/upload', data, null);
  }

  getCoverFront(
    bookTeacherId: number,
    populate: ETypesComponentStrapi[] = [
      ETypesComponentStrapi.class,
      ETypesComponentStrapi.professor,
    ]
  ): Observable<Model<TeacherBookModel>> {
    let params = new HttpParams();
    if (populate.length > 0) {
      const filters = populate.join(',');
      console.log(populate, filters);
      params = params.set('populate', filters);
    }

    return this.apiGatewayService
      .get<TeacherBookModel>(`/livros/${bookTeacherId}`, { params })
      .pipe(map(res => res.data));
  }
}
