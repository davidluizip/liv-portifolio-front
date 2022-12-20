import { Component, OnInit } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { EPages } from 'src/app/shared/enum/e-pages';
import { TeacherBookModel } from '../../models/teacher-book.model';
import { RegisterServiceAPI } from '../../services/api/register.service';
import { PageControllerService } from '../../services/page-controller.service';

import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'liv-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  readonly registerFields$ = this.registerService.registerFields$;
  public registers$: Observable<Model<TeacherBookModel>>;

  constructor(
    private registerService: RegisterService,
    private readonly _pageControllerService: PageControllerService,
    private _registerServiceAPI: RegisterServiceAPI
  ) {}
  ngOnInit(): void {
    this._pageControllerService.currentPage$.subscribe(page => {
      if (EPages.REGISTER == page) {
        //this.registers$ =
        this._registerServiceAPI
          .get(this._pageControllerService.snapshot.bookId)
          .pipe(tap(console.log), take(1))
          .subscribe(res => console.log(res.attributes.registros.midia.data));
      }
    });
  }
  handleOpenRegisterTypeModal(fieldId: number) {
    this.registerService.openRegisterTypeModal(fieldId);
  }
}
