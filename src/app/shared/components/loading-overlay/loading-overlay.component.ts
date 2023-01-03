import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'liv-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
})
export class LoadingOverlayComponent implements OnInit {
  @Input() title: string;

  constructor() {}

  ngOnInit(): void {}
}
