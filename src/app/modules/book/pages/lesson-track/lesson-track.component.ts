import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'liv-lesson-track',
  templateUrl: './lesson-track.component.html',
  styleUrls: ['./lesson-track.component.scss'],
})
export class LessonTrackComponent implements OnInit {
  @Input() book: any;

  constructor() {}

  ngOnInit(): void {}
}
