import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '@app/@shared/modals/components/delete/delete.component';
import { PopupModal } from '@app/@shared/Models/popup-modal';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { DataService } from './../../../@shared/services/data.service';

@Component({
  selector: 'app-edit-terms-and-conditions',
  templateUrl: './edit-terms-and-conditions.component.html',
  styleUrls: ['./edit-terms-and-conditions.component.scss'],
})
export class EditTermsAndConditionsComponent implements OnInit {
  popupRef = new PopupModal(this.matDialog);
  empForm: FormGroup;

  constructor(private matDialog: MatDialog, private fb: FormBuilder, public dataService: DataService) {
    this.empForm = this.fb.group({
      employees: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.addEmployee();
  }
  openItemModalTwo() {
    this.matDialog.closeAll();
    const dialogRef = this.popupRef.openModal('delete', DeleteComponent);
  }
  employees(): FormArray {
    return this.empForm.get('employees') as FormArray;
  }
  newEmployee(): FormGroup {
    return this.fb.group({
      firstName: '',
      lastName: '',
      skills: this.fb.array([]),
    });
  }

  addEmployee() {
    console.log('Adding a employee');
    this.employees().push(this.newEmployee());
  }

  removeContent(empIndex: number) {
    this.employees().removeAt(empIndex);
  }

  employeeSkills(empIndex: number): FormArray {
    return this.employees().at(empIndex).get('skills') as FormArray;
  }

  newSkill(): FormGroup {
    return this.fb.group({
      skill: '',
      exp: '',
    });
  }

  addEmployeeSkill(empIndex: number) {
    this.employeeSkills(empIndex).push(this.newSkill());
  }

  removeEmployeeSkill(empIndex: number, skillIndex: number) {
    this.employeeSkills(empIndex).removeAt(skillIndex);
  }

  onSubmit() {
    console.log(this.empForm.value);
  }
}

export class country {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
