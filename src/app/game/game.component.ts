import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, doc, setDoc, getFirestore, docData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  firestore: Firestore = inject(Firestore);
  gameCollection = collection(this.firestore, 'games');
  gameId: string = '';
  db = getFirestore();
  gameOver = false;


  constructor(public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params: any) => {
      this.getGameData(params);
    })

  }

  getGameData(params: any) {
    this.gameId = params['id'];
    let docRef = doc(this.gameCollection, this.gameId);
    let game$ = docData(docRef);
    game$.subscribe((game: any) => {
      this.setGameData(game);
    });
  }

  setGameData(game: any) {
    this.game.players = game.players;
    this.game.playerImages = game.playerImages;
    this.game.stack = game.stack;
    this.game.playedCards = game.playedCards;
    this.game.currentPlayer = game.currentPlayer;
    this.game.currentCard = game.currentCard;
    this.game.pickCardAnimation = game.pickCardAnimation;
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation && this.game.players.length > 1) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
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
        this.game.players.push(name);
        this.game.playerImages.push('player_1.png');
        this.saveGame();
      }
    });
  }

  editPlayer(playerId: number) {
    console.log('Edit player', playerId);
    let dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe((change: string) => {
      console.log('Recieved change', change);
      if (change) {
        if (change == 'DELETE') {
          this.game.playerImages.splice(playerId, 1);
          this.game.players.splice(playerId, 1);
        } else {
          this.game.playerImages[playerId] = change;
        }
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
