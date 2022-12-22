import { Component, OnInit } from '@angular/core';
import { filter, Observable, switchMap, take, tap } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { PhotoModel } from '../../models/photo.model';
import { TeacherBookModel } from '../../models/teacher-book.model';
import { RegisterService } from '../../services/api/register.service';
import { PageControllerService } from '../../services/page-controller.service';

import { RegisterContextService } from '../../services/register-context.service';

@Component({
  selector: 'liv-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  readonly registerFields$ = this.registerContextService.registerFields$;
  public registers$: Observable<Model<TeacherBookModel>>;
  public midias: Model<PhotoModel>[] = [];

  constructor(
    private registerContextService: RegisterContextService,
    private pageControllerService: PageControllerService,
    private registerService: RegisterService
  ) {}
  ngAfterViewInit(): void {
    //this.registers$ =
    this.pageControllerService.currentPage$
      .pipe(
        tap(d => console.log('RegisterComponent', d)),
        filter(page => EPages.register === page),
        switchMap(() =>
          this.registerService
            .get(this.pageControllerService.snapshot.bookId)
            .pipe(take(1))
        )
      )
      .subscribe(res => {
        this.midias = res.attributes.registros.midia.data;
        if (this.midias.length < 4) {
          const addRegister = 4 - this.midias.length;
          for (let index = 1; index <= addRegister; index++) {
            this.midias.push({ id: 0 } as Model<PhotoModel>);
          }
        }
      });
  }
  ngOnInit(): void {}

  handleOpenRegisterTypeModal(fieldId: number): void {
    this.registerContextService.openRegisterTypeModal(fieldId);
  }
}
