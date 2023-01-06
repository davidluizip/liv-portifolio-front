import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Colors,
  PageControllerService,
} from '../../services/page-controller.service';

@Component({
  selector: 'liv-lesson-track-register',
  templateUrl: './lesson-track-register.component.html',
  styleUrls: ['./lesson-track-register.component.scss'],
})
export class LessonTrackRegisterComponent {
  readonly colors$: Observable<Colors> = this.pageControllerService.colors$;

  constructor(private pageControllerService: PageControllerService) {}
}
