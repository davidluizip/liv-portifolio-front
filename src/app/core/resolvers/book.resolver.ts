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
        this.buildDynamicPages(attributes);
      })
    );
  }

  private getMainBookContent(bookId: number) {
    return this.coverFrontService.getClassData(bookId).pipe(
      take(2),
      tap(data => {
        if (data.attributes) {
          const { id_externo_strapi } = data.attributes.serie;

          const { colors, mascot } = bookConfig[id_externo_strapi];

          this.pageControllerService.saveContent(data);
          this.pageControllerService.saveExternalIdStrapi(id_externo_strapi);
          this.pageControllerService.saveColors(colors);
          this.pageControllerService.saveMascot(mascot);
        }
      }),
      switchMap(() =>
        this.lessonTrackService.getResumeRegister(
          this.pageControllerService.snapshot.externalIdStrapi
        )
      ),
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

  private buildDynamicPages(attributes: ResumeRegisterModel) {
    if (attributes.count > 0) {
      let pageEnum: EPages;

      for (const page of attributes.paginas) {
        if (page.pagina_aula_registro) {
          pageEnum = EPages.lesson_track_register;
        } else {
          pageEnum = EPages.lesson_track_register;
        }

        this.pageControllerService.saveDynamicPage({
          pageId: page.id,
          page: pageEnum,
        });
      }

      this.pageControllerService.saveDynamicPage({
        page: EPages.register,
      });
    }

    this.buildPages();
  }

  private buildPages() {
    const { dynamicPages } = this.pageControllerService.snapshot;

    let start: number;
    let end: number;

    for (let index = 2; index < dynamicPages.length; index += 2) {
      start = index;
      end = start + 2;

      this.pageControllerService.savePages(dynamicPages.slice(start, end));
    }
  }
}
