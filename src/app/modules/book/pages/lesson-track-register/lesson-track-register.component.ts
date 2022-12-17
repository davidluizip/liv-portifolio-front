import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'liv-lesson-track-register',
  templateUrl: './lesson-track-register.component.html',
  styleUrls: ['./lesson-track-register.component.scss'],
})
export class LessonTrackRegisterComponent implements OnInit {
  @Input() book: any;

  constructor() {}

  ngOnInit(): void {}
}
