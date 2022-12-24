import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { ApiGatewayService } from 'src/app/core/services/api/api-gateway.service';
import { ETypesComponentStrapi } from 'src/app/shared/enum/types-component-strapi.enum';
import { filterResponse } from 'src/app/shared/rxjs/custom-operators';
import { MediaModel } from '../../models/media.model';
import { TeacherBookModel } from '../../models/teacher-book.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private apiGatewayService: ApiGatewayService) {}

  uploadMedia(data: FormData): Observable<Model<MediaModel>> {
    return this.apiGatewayService
      .upload<Model<MediaModel>>('/upload', data, null)
      .pipe(filterResponse(), tap(console.log));
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
