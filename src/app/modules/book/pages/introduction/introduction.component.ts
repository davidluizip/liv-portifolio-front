import { Component, OnInit } from '@angular/core';
import { filter, map, Observable, switchMap, take } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { PortfolioBookModel } from '../../models/portfolio-book.model';
import { IntroService } from '../../services/api/intro.service';
import {
  Colors,
  PageControllerService,
} from '../../services/page-controller.service';

@Component({
  selector: 'liv-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
})
export class IntroductionComponent implements OnInit {
  readonly colors$: Observable<Colors> = this.pageControllerService.colors$;
  public description$: Observable<string>;

  constructor(
    private introService: IntroService,
    private pageControllerService: PageControllerService
  ) {}

  ngOnInit(): void {
    this.description$ = this.pageControllerService.currentPage$.pipe(
      filter(page => EPages.class === page),
      switchMap(() => this.introService.get().pipe(take(1))),
      map(({ attributes }) => attributes.introducao.descricao)
    );
  }
}
