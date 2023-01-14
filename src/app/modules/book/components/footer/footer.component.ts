import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'liv-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @Input() totalPages = 0;
  @Input() currentPage = 0;
  @Input() background: string;

  @Input() placement: 'right' | 'left' = 'left';

  constructor() {}

  ngOnInit(): void {}
}
