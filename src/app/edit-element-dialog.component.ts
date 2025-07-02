import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PeriodicElement } from './periodic-element.model';

export interface DialogData {
  element: PeriodicElement;
  field: keyof PeriodicElement;
  value: string | number;
}

@Component({
  selector: 'app-edit-element-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h1 mat-dialog-title>Edytuj wartość dla {{ data.element.name }}</h1>
    <div mat-dialog-content>
      <p>Zmiana pola: <strong>{{ data.field }}</strong></p>
      <mat-form-field appearance="fill">
        <mat-label>Nowa wartość</mat-label>
        <input matInput [(ngModel)]="editedValue" (keydown.enter)="onSave()" cdkFocusInitial>
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Anuluj</button>
      <button mat-flat-button color="primary" [mat-dialog-close]="editedValue" (click)="onSave()">Zapisz</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditElementDialogComponent {
  public data: DialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<EditElementDialogComponent>);

  editedValue = this.data.value;

  onSave(): void {
    let finalValue: string | number = this.editedValue;
    if (this.data.field === 'weight' || this.data.field === 'number') {
        const parsed = parseFloat(String(this.editedValue));
        if (!isNaN(parsed)) {
            finalValue = parsed;
        }
    }
    this.dialogRef.close(finalValue);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}