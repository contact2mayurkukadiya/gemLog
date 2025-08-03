import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User
} from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app'; // <-- Import FirebaseApp

import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // **** FIX ****
  // 1. DECLARE the property here without initializing it.
  readonly user$: Observable<User | null>;

  constructor(private app: FirebaseApp, private auth: Auth) {
    console.log("AuthService received initialized Firebase App:", this.app);
    // Now, 'this.auth' is guaranteed to exist.
    this.user$ = authState(this.auth);
  }

  getCurrentUserId(): string | undefined {
    return this.auth.currentUser?.uid;
  }

  signup(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(signOut(this.auth));
  }
}