import { Component, OnInit } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent implements OnInit {

  allProfilePictures = ['player_1.png', 'player_2.png', 'player_3.png', 'player_4.png', 'player_5.png', 'player_6.png'];

  constructor(private dialogRef: MatDialogRef<EditPlayerComponent>) { }

  ngOnInit(): void {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
