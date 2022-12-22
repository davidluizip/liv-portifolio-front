import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Data } from 'src/app/core/models/liv-response-protocol.model';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { ETypesComponentStrapi } from 'src/app/shared/enum/types-component-strapi.enum';
import { PhotoModel } from '../../../models/photo.model';
import { CoverFrontService } from '../../../services/api/cover-front.service';
import { PageControllerService } from '../../../services/page-controller.service';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'liv-cover-front-backside',
  templateUrl: './cover-front-backside.component.html',
  styleUrls: ['./cover-front-backside.component.scss']
})
export class CoverFrontBacksideComponent implements OnInit, AfterViewInit {
  isEnabledEdit = false;
  textareaValue = 'Escreva aqui um breve texto sobre a sua turma.';
  midia: Data<PhotoModel>;
  photoForm: FormControl = new FormControl(null);

  constructor(
    private readonly _coverFrontService: CoverFrontService,
    private pageControllerService: PageControllerService
  ) {}

  get textareaPlaceholder() {
    return this.isEnabledEdit
      ? `Profressor, escreva aqui um uma descrição da turma.\n\nSugestão: Quantidade de alunos, características da tumas (são animados, curiosos, divertidos...).`
      : '';
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.photoForm.valueChanges
      .pipe(
        filter(file => !!file),
        switchMap(file => {
          const data = new FormData();
          data.append('files', file);

          return this._coverFrontService.uploadPhoto(data);
        })
      )
      .subscribe(data => console.log(data));

    this.pageControllerService.currentPage$
      .pipe(
        tap(d => console.log('CoverFrontBacksideComponent', d)),
        filter(page => EPages.class === page),
        switchMap(() =>
          this._coverFrontService.getCoverFront(
            this.pageControllerService.snapshot.bookId,
            ETypesComponentStrapi.class
          )
        )
      )
      .subscribe(data => {
        this.midia = data.attributes.pagina_turma.midia;
        this.textareaValue = data.attributes.pagina_turma.descricao;
      });
  }
}
