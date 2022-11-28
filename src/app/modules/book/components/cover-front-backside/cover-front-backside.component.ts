import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'liv-cover-front-backside',
  templateUrl: './cover-front-backside.component.html',
  styleUrls: ['./cover-front-backside.component.scss'],
})
export class CoverFrontBacksideComponent implements OnInit {
  isEnabledEditing = false;
  textareaValue = 'Escreva aqui um breve texto sobre a sua turma.';

  constructor() {}

  get textareaPlaceholder() {
    return this.isEnabledEditing
      ? `Profressor, escreva aqui um uma descrição da turma.\n\nSugestão: Quantidade de alunos, características da tumas (são animados, curiosos, divertidos...).`
      : '';
  }

  ngOnInit(): void {}
}
