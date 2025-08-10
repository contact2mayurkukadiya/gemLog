import { ApplicationRef, Injectable, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { concat, filter, first, fromEvent, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {
  public readonly updateReadySignal: Signal<VersionEvent | undefined>;

  constructor(
    private appRef: ApplicationRef,
    public swUpdate: SwUpdate
  ) {
    this.updateReadySignal = toSignal(this.swUpdate.versionUpdates);
  }

  public initializeUpdateCheck(): void {
    if (!this.swUpdate.isEnabled) {
      console.log('Service worker is not enabled, skipping update check.');
      return;
    }

    // --- STRATEGY 1: CHECK ON APP STABILIZATION (INITIAL LOAD) ---
    // Allow the app to stabilize before starting polling, preventing startup performance impact.
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));

    // --- STRATEGY 2: CHECK ON A REGULAR INTERVAL ---
    // Poll for updates every 2 hours.
    const everyTwoHours$ = interval(2 * 60 * 60 * 1000);

    // --- STRATEGY 3: CHECK WHEN THE BROWSER TAB BECOMES VISIBLE ---
    const whenVisible$ = fromEvent(document, 'visibilitychange').pipe(
      filter(() => document.visibilityState === 'visible')
    );

    // --- COMBINE ALL STRATEGIES ---
    // Start checking after the app is stable, then continue checking
    // on an interval OR when the app becomes visible again.
    concat(appIsStable$, whenVisible$, everyTwoHours$).subscribe(() => {
      console.log('Checking for PWA update...');
      this.swUpdate.checkForUpdate().then(updateFound => {
        if (updateFound) {
          console.log('A new version has been found!');
        } else {
          console.log('Already on the latest version.');
        }
      }).catch(err => {
        console.error('PWA update check failed:', err);
      });
    });
  }

  /**
   * Activates the downloaded update.
   */
  public activateUpdate(): void {
    if (this.swUpdate.isEnabled) {
      // this.swUpdate.activateUpdate().then(() => document.location.reload());
      document.location.reload();
    }
  }

}