import { Component, OnInit } from '@angular/core';
import { filter, map, Observable, switchMap, take } from 'rxjs';
import { EPages } from 'src/app/shared/enum/pages.enum';
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
export class IntroductionComponent implements OnInit {
  public readonly colors$: Observable<Colors> =
    this.pageControllerService.colors$;
  public description$: Observable<string>;

  constructor(
    private introService: IntroService,
    private pageControllerService: PageControllerService
  ) {}

  ngOnInit(): void {
    this.description$ = this.pageControllerService.dynamicCurrentPage$.pipe(
      filter((current) => current?.page === EPages.intro),
      switchMap(() =>
        this.introService
          .get(this.pageControllerService.snapshot.externalIdStrapi)
          .pipe(take(1))
      ),
      map(({ attributes }) => attributes.introducao?.descricao)
    );
  }
}
