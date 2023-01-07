import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { CoverFrontService } from '../../../services/api/cover-front.service';
import { PageControllerService } from '../../../services/page-controller.service';
import {
  catchError,
  EMPTY,
  filter,
  finalize,
  iif,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { LoadingOverlayService } from 'src/app/shared/components/loading-overlay/loading-overlay.service';

interface ClassData {
  turma: string;
  serie: string;
  escola: string;
  professor: string;
}

@Component({
  selector: 'liv-cover-front-backside',
  templateUrl: './cover-front-backside.component.html',
  styleUrls: ['./cover-front-backside.component.scss'],
})
export class CoverFrontBacksideComponent implements OnInit, AfterViewInit {
  public photoControl: FormControl = new FormControl(null);
  public descriptionControl: FormControl = new FormControl('');

  public data$: Observable<ClassData>;

  public savingDescription = false;
  public isEnabledEdit = true;

  private fileId: number | null;

  constructor(
    private coverFrontService: CoverFrontService,
    private pageControllerService: PageControllerService,
    private toastService: ToastService,
    private loadingOverlayService: LoadingOverlayService
  ) {}

  get textareaPlaceholder() {
    return this.isEnabledEdit
      ? `Profressor, escreva aqui um uma descrição da turma.\n\nSugestão: Quantidade de alunos, características da tumas (são animados, curiosos, divertidos...).`
      : '';
  }

  get disableEditDescription() {
    return (
      this.descriptionControl.value?.trim() === '' || this.savingDescription
    );
  }

  ngOnInit(): void {
    this.getClassData();
  }

  ngAfterViewInit(): void {
    this.photoControl.valueChanges
      .pipe(
        tap(() => this.loadingOverlayService.open()),
        switchMap((file: File | null) =>
          this.chooseUpdateAction(file).pipe(
            finalize(() => this.loadingOverlayService.remove())
          )
        ),
        catchError(() => {
          this.toastService.error(
            'Houve um erro inesperado, por favor tente novamente mais tarde'
          );
          return EMPTY;
        })
      )
      .subscribe();
  }

  handleSaveDescription(): void {
    const description: string = this.descriptionControl.value;

    if (description.trim() !== '') {
      this.savingDescription = true;
      const data = {
        data: {
          pagina_turma: {
            descricao: description,
          },
        },
      };

      this.coverFrontService
        .saveClassDescription(this.pageControllerService.snapshot.bookId, data)
        .pipe(
          catchError(() => {
            this.toastService.error(
              'Houve um erro inesperado ao atualizar a descrição da turma'
            );
            return EMPTY;
          }),
          finalize(() => (this.savingDescription = false))
        )
        .subscribe(() => {
          this.isEnabledEdit = !this.isEnabledEdit;
          this.toastService.success(
            'A descrição da turma foi atualizada com sucesso 🥳'
          );
        });
    }
  }

  getClassData(): void {
    this.data$ = this.pageControllerService.currentPage$.pipe(
      filter(page => EPages.class === page),
      switchMap(() =>
        this.coverFrontService.getClassData(
          this.pageControllerService.snapshot.bookId
        )
      ),
      tap(({ attributes }) => {
        if (attributes.pagina_turma?.midia?.data) {
          this.fileId = attributes.pagina_turma.midia.data.id;
          this.photoControl.patchValue(
            attributes.pagina_turma.midia.data.attributes.url,
            {
              emitEvent: false,
              onlySelf: true,
            }
          );
        }

        if (attributes.pagina_turma?.descricao) {
          this.descriptionControl.patchValue(
            attributes.pagina_turma?.descricao,
            { emitEvent: false }
          );
          this.isEnabledEdit = false;
        }
      }),
      map(({ attributes }) => {
        return {
          turma: attributes.turma,
          serie: attributes.serie.nome,
          professor: attributes.professor?.data?.attributes.apelido,
          escola: attributes.escola,
        };
      })
    );
  }

  private chooseUpdateAction(file: File | null) {
    const data = new FormData();
    data.append('files', file);

    const bookTeacherId = this.pageControllerService.snapshot.bookId;

    return iif(
      () => !!file,
      this.coverFrontService.uploadPhoto(bookTeacherId, data).pipe(
        tap(({ id, attributes }) => {
          this.fileId = id;
          this.photoControl.patchValue(attributes.url, {
            emitEvent: false,
            onlySelf: true,
          });
        })
      ),
      this.coverFrontService.removePhoto(this.fileId)
    );
  }
}
