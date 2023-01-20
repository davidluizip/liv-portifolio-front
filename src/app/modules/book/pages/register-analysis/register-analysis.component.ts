import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { RegisterContextService } from '../../services/register-context.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'liv-register-analysis',
  templateUrl: './register-analysis.component.html',
  styleUrls: ['./register-analysis.component.scss']
})
export class RegisterAnalysisComponent implements OnInit {
  readonly registerFields$ = this.registerContextService.registerFields$.pipe(
    map(registers => registers.slice(0,2)));
    
  constructor(
    private registerContextService: RegisterContextService
    ) { }

  ngOnInit(): void {
  }

}
