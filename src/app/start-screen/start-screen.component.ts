import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, collectionData, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { doc, setDoc, getDoc, addDoc, DocumentReference } from "firebase/firestore";
import { ActivatedRoute } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  
  firestore: Firestore = inject(Firestore);
  gameCollection = collection(this.firestore, 'games');
  game: Game;

  constructor(private router: Router) { }

  newGame() {
    //start new game
    this.game = new Game();
    addDoc(this.gameCollection, this.game.toJson()).then((gameInfo: any) => {
      this.router.navigateByUrl('/game/' + gameInfo['id']);
    });
  }
}
