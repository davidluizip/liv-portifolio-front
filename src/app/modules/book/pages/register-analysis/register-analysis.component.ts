import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { RegisterContextService } from '../../services/register-context.service';

@Component({
  selector: 'liv-register-analysis',
  templateUrl: './register-analysis.component.html',
  styleUrls: ['./register-analysis.component.scss']
})
export class RegisterAnalysisComponent {
  @Input() indexPage: number;

  readonly registerFields$ = this.registerContextService.registerFields$.pipe(
    map((registers) => registers.slice(4, 6))
  );
  readonly registerAnalysis$ = this.registerContextService.registerAnalysis$;

  constructor(private registerContextService: RegisterContextService) {}

  handleOpenModal() {
    this.registerContextService.openRegisterAnalysisModal(this.indexPage);
  }
}
