import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BookState,
  PageControllerService
} from 'src/app/shell/services/page-controller.service';

@Component({
  selector: 'liv-cover-front',
  templateUrl: './cover-front.component.html',
  styleUrls: ['./cover-front.component.scss']
})
export class CoverFrontComponent implements OnInit {
  readonly book$: Observable<BookState> = this.pageControllerService.state$;

  @Output() seePortfolio = new EventEmitter();

  constructor(private pageControllerService: PageControllerService) {}

  ngOnInit(): void {}
}
