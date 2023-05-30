import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, collectionData, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { doc, setDoc, getDoc, getFirestore, addDoc } from "firebase/firestore";
import { ActivatedRoute } from '@angular/router';





@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game!: Game;
  gameId: string | any = '';
  firestore: Firestore = inject(Firestore);
  gameCollection = collection(this.firestore, 'games');
  db = getFirestore();


  constructor(public dialog: MatDialog, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      let docRef = doc(this.gameCollection, this.gameId);
      let game$ = docData(docRef);
      game$.subscribe((game: any) => {
        console.log('Game update:', game);
        this.setGameData(game);
      });
    });
  }

  setGameData(game: any) {
    this.game.currentPlayer = game.currentPlayer;
    this.game.playedCards = game.playedCards;
    this.game.player = game.player;
    this.game.stack = game.stack;
    this.game.currentCard = game.currentCard;
    this.game.pickCardAnimation = game.pickCardAnimation;
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation && this.game.player.length > 1) {
      this.game.currentCard = this.game.stack.pop();
      
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.player.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.player.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    const docRef = doc(this.db, 'games', this.gameId);
    const gameData = this.game.toJson();
    setDoc(docRef, gameData).then(() => {

    });
  }
}
