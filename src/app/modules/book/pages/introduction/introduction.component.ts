import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Colors,
  PageControllerService,
} from '../../services/page-controller.service';

@Component({
  selector: 'liv-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
})
export class IntroductionComponent {
  readonly colors$: Observable<Colors> = this.pageControllerService.colors$;

  constructor(private pageControllerService: PageControllerService) {}
}
