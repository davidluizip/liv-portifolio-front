import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, take, tap } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { ApiGatewayService } from 'src/app/core/services/api/api-gateway.service';
import { ETypesComponentStrapi } from 'src/app/shared/enum/types-component-strapi.enum';
import { filterResponse } from 'src/app/shared/rxjs/custom-operators';
import { MediaModel } from '../../models/media.model';
import {
  SaveRegisterPageDescription,
  TeacherBookModel
} from '../../models/teacher-book.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private apiGatewayService: ApiGatewayService) {}

  uploadMedia(
    data: FormData,
    bookId: number,
    type: ETypesComponentStrapi
  ): Observable<Model<MediaModel>> {
    return this.apiGatewayService
      .upload<Model<MediaModel>>(`/livros/upload/${type}/${bookId}`, data, null)
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
  saveRegisterDescription(
    bookTeacherId: number,
    data: SaveRegisterPageDescription
  ): void {
    this.apiGatewayService
      .put<void>(`/livros/${bookTeacherId}`, data)
      .pipe(take(1))
      .subscribe();
  }
}
