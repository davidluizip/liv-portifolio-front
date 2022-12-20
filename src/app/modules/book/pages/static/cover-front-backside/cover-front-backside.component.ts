import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Data } from 'src/app/core/models/liv-response-protocol.model';
import { EPages } from 'src/app/shared/enum/e-pages';
import { ETypeComponentStrapi } from 'src/app/shared/enum/e-type-component-strapi';
import { PhotoModel } from '../../../models/photo.model';
import { CoverFrontService } from '../../../services/api/cover-front.service';
import { PageControllerService } from '../../../services/page-controller.service';

@Component({
  selector: 'liv-cover-front-backside',
  templateUrl: './cover-front-backside.component.html',
  styleUrls: ['./cover-front-backside.component.scss']
})
export class CoverFrontBacksideComponent implements OnInit {
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

  ngOnInit(): void {
    this.photoForm.valueChanges.subscribe(file => {
      if (file != null) {
        const data = new FormData();
        data.append('files', file);
        this._coverFrontService.uploadPhoto(data).subscribe(res => {
          console.log('uploadPhoto', res);
        });
      }
    });
    this.pageControllerService.currentPage$.subscribe(page => {
      if (EPages.COVER_FRONTBACKSIDE == page) {
        this._coverFrontService
          .getCoverFront(
            this.pageControllerService.snapshot.bookId,
            ETypeComponentStrapi.pagina_turma
          )
          .subscribe(res => {
            this.midia = res.attributes.pagina_turma.midia;
            this.textareaValue = res.attributes.pagina_turma.descricao;
          });
      }
    });
  }
}
