import { Component, ChangeDetectionStrategy, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElementsStore } from './elements.store';
import { PeriodicElement } from './periodic-element.model';
import { EditElementDialogComponent } from './edit-element-dialog.component';

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  providers: [ElementsStore],
  templateUrl: './elements-table.component.html',
  styleUrls: ['./elements-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementsTableComponent implements OnDestroy {
  readonly store = inject(ElementsStore);
  private readonly dialog = inject(MatDialog);

  readonly displayedColumns: (keyof PeriodicElement)[] = ['number', 'name', 'weight', 'symbol'];
  readonly filterControl = new FormControl('', { nonNullable: true });
  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.filterControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.store.updateFilter(value));
  }

  openEditDialog(element: PeriodicElement, field: keyof PeriodicElement): void {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '350px',
      data: { element, field, value: element[field] },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== null) {
        const updatedElement = { ...element, [field]: result };
        this.store.updateElement(updatedElement);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}