import { HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { ApiGatewayService } from 'src/app/core/services/api/api-gateway.service';
import { ETypesComponentStrapi } from 'src/app/shared/enum/types-component-strapi.enum';
import { PhotoModel } from '../../models/photo.model';
import { TeacherBookModel } from '../../models/teacher-book.model';

@Injectable({
  providedIn: 'root',
})
export class CoverFrontService {
  constructor(private _apiGatewayService: ApiGatewayService) {}

  /** Para controller no response sobre os componentes que devem retornar */

  uploadPhoto(data: FormData): Observable<HttpEvent<PhotoModel>> {
    return this._apiGatewayService.upload<PhotoModel>('/upload', data, null);
  }
  getCoverFront(
    bookTeacherId: number,
    typeComponent = ETypesComponentStrapi.professor
  ): Observable<Model<TeacherBookModel>> {
    const params = new HttpParams().set('populate', typeComponent);

    return this._apiGatewayService
      .get<TeacherBookModel>(`/livros/${bookTeacherId}`, { params })
      .pipe(map(res => res.data));
  }
}
