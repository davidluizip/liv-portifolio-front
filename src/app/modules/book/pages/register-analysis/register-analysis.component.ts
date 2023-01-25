import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs';
import { RegisterContextService } from '../../services/register-context.service';
import { ProfessorAnalysisModalComponent } from './professor-analysis-modal/professor-analysis-modal.component';

@Component({
  selector: 'liv-register-analysis',
  templateUrl: './register-analysis.component.html',
  styleUrls: ['./register-analysis.component.scss']
})
export class RegisterAnalysisComponent implements OnInit {
  readonly registerFields$ = this.registerContextService.registerFields$.pipe(
    map(registers => registers.slice(0,2)));

  constructor(
    private registerContextService: RegisterContextService,
    private ngbModal: NgbModal
    ) { }

  ngOnInit(): void {
  }

  handleOpenModal(){
    this.ngbModal.open(ProfessorAnalysisModalComponent, {
      centered: true
    });
  }

}
