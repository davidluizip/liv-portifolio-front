import { Component, OnInit } from '@angular/core';
import { filter, Observable, switchMap, take, tap } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { EPages } from 'src/app/shared/enum/pages.enum';
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
        filter(({ attributes }) => !!attributes.registros?.midia?.data)
      )
      .subscribe(({ attributes }) => {
        console.log(attributes);
      });
  }

  handleOpenRegisterTypeModal(fieldId: number): void {
    this.registerContextService.openRegisterTypeModal(fieldId);
  }
}
