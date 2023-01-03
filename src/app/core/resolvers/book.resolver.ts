import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { catchError, EMPTY, switchMap, take, tap } from 'rxjs';
import bookConfig from 'src/app/modules/book/book-config';
import { ResumeRegisterModel } from 'src/app/modules/book/models/portfolio-book.model';
import { CoverFrontService } from 'src/app/modules/book/services/api/cover-front.service';
import { LessonTrackService } from 'src/app/modules/book/services/api/lesson-track.service';
import { PageControllerService } from 'src/app/modules/book/services/page-controller.service';
import { LoadingOverlayService } from 'src/app/shared/components/loading-overlay/loading-overlay.service';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { Model } from '../models/liv-response-protocol.model';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class BookResolver implements Resolve<Model<ResumeRegisterModel>> {
  constructor(
    private coverFrontService: CoverFrontService,
    private lessonTrackService: LessonTrackService,
    private pageControllerService: PageControllerService,
    private loadingOverlayService: LoadingOverlayService,
    private toastService: ToastService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot) {
    const bookId = route.paramMap.get('id');
    this.pageControllerService.saveBookId(Number(bookId));

    this.loadingOverlayService.open();

    return this.getMainBookContent(Number(bookId)).pipe(
      tap(({ attributes }) => {
        this.buildPages(attributes);
      })
    );
  }

  private getMainBookContent(bookId: number) {
    return this.coverFrontService.getClassData(bookId).pipe(
      take(2),
      tap(data => {
        if (data.attributes) {
          const serie = data.attributes.serie.replace(/ /g, '-');

          const { colors, mascot } = bookConfig[serie];

          this.pageControllerService.saveContent(data);
          this.pageControllerService.saveColors(colors);
          this.pageControllerService.saveMascot(mascot);
        }
      }),
      switchMap(() => this.lessonTrackService.getResumeRegister()),
      catchError(() => {
        this.toastService.error(
          'Houve um erro ao carregar o livro, por favor, tente novamente!'
        );
        this.loadingOverlayService.remove();
        this.router.createUrlTree(['404']);
        return EMPTY;
      })
    );
  }

  private buildPages(attributes: ResumeRegisterModel) {
    Array.from({ length: attributes.count }).forEach(() => {
      if (attributes.pagina_aula_registro)
        this.pageControllerService.savePage(EPages.lesson_track_register);
      else this.pageControllerService.savePage(EPages.lesson_track);
    });
    this.pageControllerService.savePage(EPages.register);
  }
}
