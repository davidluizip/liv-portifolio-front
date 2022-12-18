import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { ApiGatewayService } from 'src/app/core/services/api/api-gateway.service';
import { TypeComponentStrapi } from 'src/app/shared/type-component-strapi';
import { TeacherBookModel } from '../../models/teacher-book.model';

@Injectable({
  providedIn: 'root',
})
export class CoverFrontService {
  constructor(private _apiGatewayService: ApiGatewayService) {}

  /** Para controller no response sobre os componentes que devem retornar */

  getCoverFront(bookTeacherId: number): Observable<Model<TeacherBookModel>> {
    const params = new HttpParams().set(
      'populate',
      TypeComponentStrapi.professor
    );

    return this._apiGatewayService
      .get<TeacherBookModel>(`/livros/${bookTeacherId}`, { params })
      .pipe(map(res => res.data));
  }
}
