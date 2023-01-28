import { Component, Input, OnInit } from '@angular/core';
import { distinctUntilChanged, first, map, tap } from 'rxjs';
import { RegisterType } from '../../enums/register-type.enum';
import { RegisterContextService } from '../../services/register-context.service';

@Component({
  selector: 'liv-register-analysis',
  templateUrl: './register-analysis.component.html',
  styleUrls: ['./register-analysis.component.scss']
})
export class RegisterAnalysisComponent {
  @Input() indexPage: number;

  public readonly registerFields$ =
    this.registerContextService.registerAnalysisFields$.pipe(
      distinctUntilChanged()
    );
  public readonly registerAnalyse$ =
    this.registerContextService.registerAnalysis$.pipe(distinctUntilChanged());
  public readonly registerPageType = RegisterType.register_analysis;

  constructor(private registerContextService: RegisterContextService) {}

  handleOpenModal() {
    this.registerContextService.openRegisterAnalysisModal(this.indexPage);
  }
}
