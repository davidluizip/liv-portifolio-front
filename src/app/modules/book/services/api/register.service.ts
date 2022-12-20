import { HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { ApiGatewayService } from 'src/app/core/services/api/api-gateway.service';
import { ETypesComponentStrapi } from 'src/app/shared/enum/types-component-strapi.enum';
import { PhotoModel } from '../../models/photo.model';
import { PortfolioBookModel } from '../../models/portfolio-book.model';
import { TeacherBookModel } from '../../models/teacher-book.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private apiGatewayService: ApiGatewayService) {}

  uploadPhoto(data: FormData): Observable<HttpEvent<PhotoModel>> {
    return this.apiGatewayService.upload<PhotoModel>('/upload', data, null);
  }

  get(
    bookTeacherId: number,
    typeComponent = ETypesComponentStrapi.registers
  ): Observable<Model<TeacherBookModel>> {
    const params = new HttpParams().set('populate', typeComponent);

    return this.apiGatewayService
      .get<TeacherBookModel>(`/livros/${bookTeacherId}`, { params })
      .pipe(map(res => res.data));
  }
}
