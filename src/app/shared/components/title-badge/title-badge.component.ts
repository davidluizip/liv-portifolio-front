import { Component, Input } from '@angular/core';

@Component({
  selector: 'liv-title-badge',
  templateUrl: './title-badge.component.html',
  styleUrls: ['./title-badge.component.scss'],
})
export class TitleBadgeComponent {
  @Input() name: string;
}
