import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ToDoTableDataSource } from './to-do-table-datasource';
import { MatDialog } from "@angular/material";
import { ToDoService } from '../service-provider/data.service';
import { ToDoItem } from '../models/toDoItem';
import { DialogComponent } from '../dialog-component/dialog-component';
import { Observable, Subscriber, observable } from 'rxjs';

@Component({
  selector: 'app-to-do-table',
  templateUrl: './to-do-table.component.html',
  styleUrls: ['./to-do-table.component.css'],
})
export class ToDoTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private todoService: ToDoService, private formBuilder: FormBuilder, public dialog: MatDialog) {
  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['save', 'delete', 'id', 'name', 'description', 'date', 'time', 'done'];
  dataSource: ToDoTableDataSource;
  registerForm: FormGroup;
  submitted = false;
  editTable: Boolean = true;
  addNew: Boolean = true;
  loader: Boolean = true;
  editRow: Boolean = true;

  toDoItem: ToDoItem = {
    name: '',
    description: '',
    date: new Date(),
    done: false
  }

  ngOnInit() {
    this.dataSource = new ToDoTableDataSource(this.paginator, this.sort, this.todoService);
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(20)]],
      date: [new Date(), Validators.required],
      time: ['', Validators.required],
      done: [false],
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.openDialog("Empty fields is required", true).subscribe(res => { });
      return;
    }

    this.loader = false;
    this.todoService.saveNew(this.registerForm.value).subscribe(result => {
      this.loader = true;
      this.registerForm.reset();
      this.refresh();
    })
  }

  refresh() {
    this.dataSource = new ToDoTableDataSource(this.paginator, this.sort, this.todoService);
  }

  updateAll() {
    for (let element of this.dataSource.data) {
      this.update(element);
    }
  }

  deleteAll() {
    this.openDialog("Are you sure?", false).subscribe(res => {
      if (res.toString() === 'Confirm') {
        for (let element of this.dataSource.data) {
          this.delete(element.id);
        }
      } else {
        return;
      }
    });

  }

  update(job) {
    this.loader = false;
    this.todoService.update(job).subscribe(res => {
      this.loader = true;
      this.refresh();
      this.editTable = true;
    });
  }

  delete(id) {
    this.loader = false;
    this.todoService.delete(id).subscribe((res) => {
      this.loader = true;
      this.refresh();
      this.editTable = true;
    })
  }

  openDialog(error: string, isAlert: boolean) {
    return new Observable(observable => {
      let dialogRef = this.dialog.open(DialogComponent, {
        width: '600px',
        data: { errorMsg: error, isAlert: isAlert }
      });
      dialogRef.afterClosed().subscribe(result => {
        observable.next(result);
      });
    })
  }

  isModified(ev, object) {
    object.updatable = false;
  }

  doneOrNot(value) {
    value = !value;
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.toDoItem.date = event.value;
  }


}
