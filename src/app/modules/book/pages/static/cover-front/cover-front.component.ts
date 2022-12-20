import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { filter, Observable, switchMap, take, tap } from 'rxjs';
import { grades } from '../../../grades';
import { CoverFrontService } from '../../../services/api/cover-front.service';
import {
  BookState,
  PageControllerService
} from '../../../services/page-controller.service';

@Component({
  selector: 'liv-cover-front',
  templateUrl: './cover-front.component.html',
  styleUrls: ['./cover-front.component.scss']
})
export class CoverFrontComponent implements OnInit {
  readonly book$: Observable<BookState> =
    this.pageControllerService.state$.pipe(tap(console.log));

  @Output() seePortfolio = new EventEmitter();

  constructor(private pageControllerService: PageControllerService) {}

  ngOnInit(): void {}
}
