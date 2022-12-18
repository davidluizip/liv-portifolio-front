import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, tap } from 'rxjs';
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

  constructor(
    private pageControllerService: PageControllerService,
    private readonly _coverFrontService: CoverFrontService
  ) {}

  ngOnInit(): void {
    this._coverFrontService.getCover(12).subscribe(res => {
      console.log('DATA', res);
    });
    //this.pageControllerService.saveContent(res.data)
  }
}
