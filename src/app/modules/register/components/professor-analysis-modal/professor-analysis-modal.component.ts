import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterContextService } from '../../services/register-context.service';

@Component({
  selector: 'liv-professor-analysis-modal',
  templateUrl: './professor-analysis-modal.component.html',
  styleUrls: ['./professor-analysis-modal.component.scss']
})
export class ProfessorAnalysisModalComponent implements OnInit, AfterViewInit {
  @ViewChild('aboutStudent') textarea: ElementRef<HTMLTextAreaElement>;
  public form: FormGroup;
  public savingAnalysis = false;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private registerContextService: RegisterContextService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      analysis: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(350)
        ])
      )
    });
  }

  ngAfterViewInit(): void {
    this.textarea.nativeElement.focus();
  }

  handleCloseModal(): void {
    this.ngbActiveModal.close();
  }

  handleSaveProfessorAnalysis(): void {
    const { analysis } = this.form.value as { analysis: string };

    this.savingAnalysis = true;

    this.registerContextService.saveRegisterAnalysis(analysis).add(() => {
      this.ngbActiveModal.close();
      this.savingAnalysis = false;
    });
  }
}
