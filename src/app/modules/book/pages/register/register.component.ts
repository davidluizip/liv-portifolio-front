import { Component, OnInit } from '@angular/core';
import { filter, Observable, switchMap, take, tap } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { MediaModel } from '../../models/media.model';
import { TeacherBookModel } from '../../models/teacher-book.model';
import { RegisterService } from '../../services/api/register.service';
import { PageControllerService } from '../../services/page-controller.service';

import { RegisterContextService } from '../../services/register-context.service';

@Component({
  selector: 'liv-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  readonly registerFields$ = this.registerContextService.registerFields$.pipe(
    tap(console.log)
  );

  public registers$: Observable<Model<TeacherBookModel>>;

  constructor(
    private registerContextService: RegisterContextService,
    private pageControllerService: PageControllerService,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    // this.registers$ = this.pageControllerService.currentPage$.pipe(
    //   filter(page => EPages.register === page),
    //   switchMap(() =>
    //     this.registerService
    //       .get(this.pageControllerService.snapshot.bookId)
    //       .pipe(take(1))
    //   )
    // );

    this.pageControllerService.currentPage$
      .pipe(
        filter(page => EPages.register === page),
        switchMap(() =>
          this.registerService
            .get(this.pageControllerService.snapshot.bookId)
            .pipe(take(1))
        ),
        filter(({ attributes }) => !!attributes.registros),
        tap(data => console.log(data))
      )
      .subscribe(({ attributes }) => {
        this.registerContextService.resetSelectedRegisterField();
        if (attributes.registros.nome) {
          this.registerContextService.setFieldValue('text', {
            id: 1,
            content: {
              about: attributes.registros.descricao,
              name: attributes.registros.nome,
            },
          });
        }
        if (attributes.registros.midia.data)
          this.populateMidias(attributes.registros.midia.data);
      });
  }

  populateMidias(midias: Model<MediaModel>[]) {
    for (const midia of midias) {
      const type = midia.attributes.mime.split('/');
      this.setMedia(type[0], midia.attributes);
    }
  }

  setMedia(type, data: MediaModel) {
    switch (type) {
      case 'audio':
        this.registerContextService.setFieldValue('audio', {
          id: 2,
          content: {
            src: data.url,
          },
        });
        break;
      case 'video':
        this.registerContextService.setFieldValue('video', {
          id: 3,
          content: {
            src: data.url,
            type,
          },
        });
        break;
      case 'image':
        this.registerContextService.setFieldValue('image', {
          id: 4,
          content: {
            src: data.url,
            alt: data.alternativeText,
          },
        });
        break;

      default:
        break;
    }
  }
  handleOpenRegisterTypeModal(fieldId: number): void {
    this.registerContextService.openRegisterTypeModal(fieldId);
  }
}
