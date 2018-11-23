import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';

@Component({
  selector: 'dialog-component',
  templateUrl: 'dialog-component.html'
})

export class DialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data : any) {

  }

  ngOnInit(){}

  onCloseConfirm() {
    console.log(this.data);
    this.dialogRef.close('Confirm');
  }
  onCloseCancel() {
    console.log(this.data);
    this.dialogRef.close('Cancel');
  }
  

}

