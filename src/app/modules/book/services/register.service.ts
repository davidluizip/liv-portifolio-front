import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegisterSelectModalComponent } from '../pages/register/components/register-select-modal/register-select-modal.component';

interface TextField {
  type: 'text';
  value: {
    about: string;
    name: string;
  };
}

interface ImageField {
  type: 'image';
  value: {
    src: string;
    alt?: string;
  };
}

interface VideoField {
  type: 'video';
  value: {
    src: string;
    type: string;
  };
}

interface AudioField {
  type: 'audio';
  value: {
    src: string;
    type: string;
  };
}

type FieldData = TextField | ImageField | VideoField | AudioField | null;

interface RegisterField {
  id: number;
  data: FieldData;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private _registerFields = new BehaviorSubject<RegisterField[]>([
    {
      id: 1,
      data: null,
    },
    {
      id: 2,
      data: null,
    },
    {
      id: 3,
      data: null,
    },
    {
      id: 4,
      data: null,
    },
  ]);

  registerFields$: Observable<RegisterField[]> =
    this._registerFields.asObservable();

  private _selectedRegisterFieldId = new BehaviorSubject<number | null>(null);

  constructor(private ngbModal: NgbModal) {}

  get snapshot() {
    return {
      registerFields: this._registerFields.getValue(),
      selectedRegisterFieldId: this._selectedRegisterFieldId.getValue(),
    };
  }

  setFieldValue(id: number, data: FieldData) {
    const registerFields = this._registerFields.getValue();
    const fieldIndex = this._registerFields
      .getValue()
      .findIndex(field => field.id === id);

    registerFields[fieldIndex].data = data;
    this._registerFields.next(registerFields);
  }

  setSelectedRegisterField(id: number) {
    this._selectedRegisterFieldId.next(id);
  }

  resetSelectedRegisterField() {
    this._selectedRegisterFieldId.next(null);
  }

  resetFieldValue(id: number) {
    const registerFields = this._registerFields.getValue();
    const fieldIndex = this._registerFields
      .getValue()
      .findIndex(field => field.id === id);
    registerFields[fieldIndex].data = null;
    this._registerFields.next(registerFields);
  }

  openRegisterTypeModal(fieldId: number) {
    this._selectedRegisterFieldId.next(fieldId);
    this.ngbModal.open(RegisterSelectModalComponent, {
      centered: true,
      modalDialogClass: 'register-select-modal',
    });
  }
}
