import { HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { ApiGatewayService } from 'src/app/core/services/api/api-gateway.service';
import { ETypeComponentStrapi } from 'src/app/shared/enum/e-type-component-strapi';
import { PhotoModel } from '../../models/photo.model';
import { PortfolioBookModel } from '../../models/portfolio-book.model';
import { TeacherBookModel } from '../../models/teacher-book.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterServiceAPI {
  constructor(private _apiGatewayService: ApiGatewayService) {}
  uploadPhoto(data: FormData): Observable<HttpEvent<PhotoModel>> {
    return this._apiGatewayService.upload<PhotoModel>('/upload', data, null);
  }
  get(
    bookTeacherId: number,
    typeComponent = ETypeComponentStrapi.registros
  ): Observable<Model<TeacherBookModel>> {
    const params = new HttpParams().set('populate', typeComponent);

    return this._apiGatewayService
      .get<TeacherBookModel>(`/livros/${bookTeacherId}`, { params })
      .pipe(map(res => res.data));
  }
}
