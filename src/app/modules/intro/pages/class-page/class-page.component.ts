import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EPages } from 'src/app/shared/enums/pages.enum';
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
  tap
} from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { LoadingOverlayService } from 'src/app/shared/components/loading-overlay/loading-overlay.service';
import { ClassPageService } from '../../services/api/class-page.service';
import { PageControllerService } from 'src/app/shell/services/page-controller.service';

interface ClassData {
  turma: string;
  serie: string;
  escola: string;
  professor: string;
}

@Component({
  selector: 'liv-class-page',
  templateUrl: './class-page.component.html',
  styleUrls: ['./class-page.component.scss']
})
export class ClassPageComponent implements OnInit, AfterViewInit {
  public photoControl: FormControl = new FormControl(null);
  public descriptionControl: FormControl = new FormControl('');

  public data$: Observable<ClassData>;

  public savingDescription = false;
  public isEnabledEdit = true;

  private fileId: number | null;

  constructor(
    private classPageService: ClassPageService,
    private pageControllerService: PageControllerService,
    private toastService: ToastService,
    private loadingOverlayService: LoadingOverlayService
  ) {}

  get textareaPlaceholder() {
    return this.isEnabledEdit
      ? `Conte-nos um pouco sobre essa sua turma, sobre alguma particularidade ou curiosidade que ela possui e traga alguma experiência marcante que vocês vivenciaram juntos na aula LIV.`
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
            descricao: description
          }
        }
      };

      this.classPageService
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
    this.data$ = this.pageControllerService.dynamicPreviousPage$.pipe(
      filter((previous) => previous?.page === EPages.class),
      switchMap(() =>
        this.classPageService.getClassData(
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
              onlySelf: true
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
          escola: attributes.escola
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
      this.classPageService.uploadPhoto(bookTeacherId, data).pipe(
        tap(({ id, attributes }) => {
          this.fileId = id;
          this.photoControl.patchValue(attributes.url, {
            emitEvent: false,
            onlySelf: true
          });
        })
      ),
      this.classPageService.removePhoto(this.fileId)
    );
  }
}
