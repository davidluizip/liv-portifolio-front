import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'liv-cover-front',
  templateUrl: './cover-front.component.html',
  styleUrls: ['./cover-front.component.scss'],
})
export class CoverFrontComponent implements OnInit {
  @Input() book: any;

  @Output() seePortfolio = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
