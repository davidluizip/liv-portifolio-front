import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, take } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { EPages } from 'src/app/shared/enum/e-pages';
import { PortfolioBookModel } from '../../models/portfolio-book.model';
import { IntroService } from '../../services/api/intro.service';
import {
  Colors,
  PageControllerService
} from '../../services/page-controller.service';

@Component({
  selector: 'liv-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit, OnDestroy {
  readonly colors$: Observable<Colors> = this.pageControllerService.colors$;
  public bookPortifolio$: Observable<Model<PortfolioBookModel>>;

  constructor(
    private readonly _introService: IntroService,
    private pageControllerService: PageControllerService
  ) {}

  ngOnInit(): void {
    this.pageControllerService.currentPage$.subscribe(page => {
      if (EPages.COVER_FRONTBACKSIDE == page) {
        this.bookPortifolio$ = this._introService.get().pipe(take(1));
      }
    });
  }
  ngOnDestroy() {}
}
