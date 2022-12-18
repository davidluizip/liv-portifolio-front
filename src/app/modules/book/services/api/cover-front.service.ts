import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LivSuccessResponse } from 'src/app/core/models/liv-response-protocol.model';
import { TeacherBookModel } from 'src/app/core/models/teacher-book.model';
import { ApiGatewayService } from 'src/app/core/services/api/api-gateway.service';
import { TypeComponentStrapi } from 'src/app/shared/type-component-strapi';


@Injectable({
  providedIn: 'root'
})
export class CoverFrontService {
  constructor(private _apiGatewayService: ApiGatewayService) {}
  /*
  getCover_old(): Observable<APIResponse<PortfolioBook>> {
    return this._apiGatewayService.get<APIResponse<PortfolioBook>>(
      'livro-portifolio'
    );
  }
  getCover(idTeacher: number): Observable<APIResponse<Teacher>> {
    return this._apiGatewayService.get<APIResponse<Teacher>>(
      `professor/${idTeacher}`
    );
  }
  */
  getCover(idBookTeacher: number): Observable<LivSuccessResponse<TeacherBookModel>> {
    const params = new HttpParams().set(
      'populate',
      TypeComponentStrapi.professor
    ); // Para controller no response sobre os componentes que devem retornar

    return this._apiGatewayService.get<TeacherBookModel>(
      `/livros/${idBookTeacher}`,
      { params }
    );
  }
}
