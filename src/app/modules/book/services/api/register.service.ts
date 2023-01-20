import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, take, tap } from 'rxjs';
import {
  Data,
  Model
} from 'src/app/core/models/liv-portfolio-response-protocol.model';
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

  get(
    bookTeacherId: number,
    indexPage: number,
    populate: ETypesComponentStrapi[] = [
      ETypesComponentStrapi.registers,
      ETypesComponentStrapi.registersText
    ]
  ): Observable<Model<TeacherBookModel>> {
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
      .pipe(map((res) => res.data));
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
}
