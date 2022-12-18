import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Colors,
  PageControllerService,
} from '../../services/page-controller.service';

@Component({
  selector: 'liv-lesson-track',
  templateUrl: './lesson-track.component.html',
  styleUrls: ['./lesson-track.component.scss'],
})
export class LessonTrackComponent {
  readonly colors$: Observable<Colors> = this.pageControllerService.colors$;

  constructor(private pageControllerService: PageControllerService) {}
}
