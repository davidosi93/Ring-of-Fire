import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, collectionData, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { doc, setDoc, getDoc, getFirestore, addDoc } from "firebase/firestore";
import { ActivatedRoute } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
  constructor(private router: Router) { }
  firestore: Firestore = inject(Firestore);
  gameCollection = collection(this.firestore, 'games');
  db = getFirestore();

  ngOnInit(): void {

  }

  newGame() {
    //start new game
    let game = new Game();
    addDoc(this.gameCollection, { game: game.toJson() }).then((gameInfo: any) => {
      this.router.navigateByUrl('/game/' + gameInfo['id']);
      console.log(gameInfo);
    });

  }
}
