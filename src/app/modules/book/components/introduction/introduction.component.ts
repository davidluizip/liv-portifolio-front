import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'liv-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
})
export class IntroductionComponent {
  @Input() book: any;
}
