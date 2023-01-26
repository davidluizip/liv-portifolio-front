import { Component, Input, OnInit } from '@angular/core';
import { distinctUntilChanged, first, map, tap } from 'rxjs';
import { RegisterContextService } from '../../services/register-context.service';

@Component({
  selector: 'liv-register-analysis',
  templateUrl: './register-analysis.component.html',
  styleUrls: ['./register-analysis.component.scss']
})
export class RegisterAnalysisComponent {
  @Input() indexPage: number;

  readonly registerFields$ = this.registerContextService.registerFields$.pipe(
    distinctUntilChanged(),
    map((registers) => registers.slice(4, 6))
  );

  readonly registerAnalysis$ =
    this.registerContextService.registerAnalysis$.pipe(distinctUntilChanged());
  constructor(private registerContextService: RegisterContextService) {}

  handleOpenModal() {
    this.registerContextService.openRegisterAnalysisModal(this.indexPage);
  }
}
