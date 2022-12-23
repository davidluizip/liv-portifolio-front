import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { ETypesComponentStrapi } from 'src/app/shared/enum/types-component-strapi.enum';
import { CoverFrontService } from '../../../services/api/cover-front.service';
import { PageControllerService } from '../../../services/page-controller.service';
import {
  catchError,
  EMPTY,
  filter,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';

interface ClassData {
  turma: string;
  serie: string;
  descricao: string;
  escola: string;
  professor: string;
}

@Component({
  selector: 'liv-cover-front-backside',
  templateUrl: './cover-front-backside.component.html',
  styleUrls: ['./cover-front-backside.component.scss'],
})
export class CoverFrontBacksideComponent implements OnInit, AfterViewInit {
  isEnabledEdit = true;
  photoControl: FormControl = new FormControl(null);

  data$: Observable<ClassData>;

  constructor(
    private coverFrontService: CoverFrontService,
    private pageControllerService: PageControllerService,
    private toastService: ToastService
  ) {}

  get textareaPlaceholder() {
    return this.isEnabledEdit
      ? `Profressor, escreva aqui um uma descrição da turma.\n\nSugestão: Quantidade de alunos, características da tumas (são animados, curiosos, divertidos...).`
      : '';
  }

  ngOnInit(): void {
    this.data$ = this.pageControllerService.currentPage$.pipe(
      filter(page => EPages.class === page),
      switchMap(() =>
        this.coverFrontService.getCoverFront(
          this.pageControllerService.snapshot.bookId
        )
      ),
      tap(({ attributes }) => {
        if (attributes.pagina_turma.midia?.data) {
          this.photoControl.patchValue(
            attributes.pagina_turma.midia.data.attributes.url,
            {
              emitEvent: false,
              onlySelf: true,
            }
          );
        }

        if (attributes.pagina_turma.descricao) {
          this.isEnabledEdit = false;
        }
      }),
      map(({ attributes }) => {
        return {
          turma: attributes.turma,
          serie: attributes.serie,
          professor: attributes.professor?.data?.attributes.apelido,
          descricao:
            attributes.pagina_turma.descricao ||
            'Escreva aqui um breve texto sobre a sua turma.',
          escola: attributes.escola,
        };
      })
    );
  }

  ngAfterViewInit(): void {
    this.photoControl.valueChanges
      .pipe(
        switchMap((file: File | null) => {
          const data = new FormData();
          data.append('files', file);

          return this.coverFrontService.uploadPhoto(data).pipe(take(1));
        }),
        catchError(() => {
          this.toastService.success(
            'Houve um erro inesperado, por favor tente novamente mais tarde'
          );
          return EMPTY;
        })
      )
      .subscribe(() =>
        this.toastService.success('Sua foto foi salva com sucesso 🥳')
      );
  }
}
