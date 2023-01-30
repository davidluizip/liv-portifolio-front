import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiGatewayService } from 'src/app/core/services/api/api-gateway.service';
import { ETypesComponentStrapi } from 'src/app/shared/enums/types-component-strapi.enum';
import { filterResponse } from 'src/app/shared/rxjs/custom-operators';
import { MediaModel } from 'src/app/shell/models/media.model';
import {
  RegisterAnalysisModel,
  RegisterModel
} from 'src/app/shell/models/register.model';
import {
  SaveRegisterAnalysis,
  SaveRegisterPageDescription,
  TeacherBookModel
} from 'src/app/shell/models/teacher-book.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private apiGatewayService: ApiGatewayService) {}

  uploadMedia(
    data: FormData,
    bookId: number,
    indexPage: number,
    type: ETypesComponentStrapi
  ) {
    return this.apiGatewayService
      .upload<MediaModel>(
        `/livros/upload/${type}/${bookId}/${indexPage}`,
        data,
        null
      )
      .pipe(filterResponse());
  }

  getRegisters(
    bookTeacherId: number,
    indexPage?: number,
    populate: ETypesComponentStrapi[] = [
      ETypesComponentStrapi.registers,
      ETypesComponentStrapi.registersText
    ]
  ): Observable<RegisterModel> {
    let params = new HttpParams();
    if (populate.length > 0) {
      const filters = populate.join(',');
      params = params.set('populate', filters);
    }

    return this.apiGatewayService
      .get<TeacherBookModel>(
        `/livros/registro/page/${bookTeacherId}/${indexPage}`,
        { params }
      )
      .pipe(
        map((res) => res.data),
        map((data) => ({
          registros: data.attributes.registros
        }))
      );
  }

  getTeacherAnalysis(
    bookTeacherId: number,
    indexPage: number
  ): Observable<RegisterAnalysisModel> {
    return this.apiGatewayService
      .get<TeacherBookModel>(
        `/livros/registro/page/${bookTeacherId}/${indexPage}`
      )
      .pipe(
        map((res) => res.data),
        map((data) => ({
          analise_registro: data.attributes.registros?.analise_registro
        }))
      );
  }

  deleteMidia(midiaId: number): Observable<void> {
    return this.apiGatewayService.delete(`/livros/registro/midia/${midiaId}`);
  }

  deleteText(bookId: number, midiaId: number): Observable<void> {
    return this.apiGatewayService.delete(
      `/livros/registro/texto/${bookId}/${midiaId}`
    );
  }

  saveRegisterDescription(
    bookTeacherId: number,
    data: SaveRegisterPageDescription
  ) {
    return this.apiGatewayService.put<void>(
      `/livros/registro/texto/${bookTeacherId}`,
      data
    );
  }

  saveRegisterAnalysis({ bookId, indexPage, text }: SaveRegisterAnalysis) {
    return this.apiGatewayService.post(
      `/livros/registro/analise/${bookId}/${indexPage}`,
      {
        data: {
          analise_registro: text
        }
      }
    );
  }
}
