import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { Model } from 'src/app/core/models/liv-portfolio-response-protocol.model';
import { ApiGatewayService } from 'src/app/core/services/api/api-gateway.service';
import { ETypesComponentStrapi } from 'src/app/shared/enum/types-component-strapi.enum';
import { filterResponse } from 'src/app/shared/rxjs/custom-operators';
import { MediaModel } from '../../models/media.model';
import {
  SaveClassPageDescription,
  TeacherBookModel
} from '../../models/teacher-book.model';

@Injectable({
  providedIn: 'root'
})
export class CoverFrontService {
  constructor(private apiGatewayService: ApiGatewayService) {}

  uploadPhoto(bookTeacherId: number, data: FormData) {
    return this.apiGatewayService
      .upload<MediaModel>(
        `/livros/upload/pagina_turma/${bookTeacherId}`,
        data,
        null
      )
      .pipe(
        filterResponse(),
        map((res) => res.data)
      );
  }

  removePhoto(fileId: number) {
    return this.apiGatewayService.delete(`/livros/upload/${fileId}`);
  }

  getClassData(
    bookTeacherId: number,
    populate: ETypesComponentStrapi[] = [
      ETypesComponentStrapi.serie,
      ETypesComponentStrapi.class,
      ETypesComponentStrapi.serie,
      ETypesComponentStrapi.professor
    ]
  ): Observable<Model<TeacherBookModel>> {
    let params = new HttpParams();
    if (populate.length > 0) {
      const filters = populate.join(',');
      params = params.set('populate', filters);
    }

    return this.apiGatewayService
      .get<TeacherBookModel>(`/livros/${bookTeacherId}`, { params })
      .pipe(map((res) => res.data));
  }

  saveClassDescription(bookTeacherId: number, data: SaveClassPageDescription) {
    return this.apiGatewayService
      .put<void>(`/livros/${bookTeacherId}`, data)
      .pipe(take(1));
  }
}
