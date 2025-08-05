import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DailyLog, PriceTier } from '../core/models/gem-log.models';
import { AuthService } from '../core/services/auth.service';
import { FirestoreService } from '../core/services/firestore.service';
import { map, Observable, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    SharedModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  userId!: string;
  currentDate = new Date();


  priceTiers$!: Observable<PriceTier[]>;
  monthlyLogs$!: Observable<DailyLog[]>;

  activeTiersForMonth: PriceTier[] = [];
  allLogsForMonth: DailyLog[] = [];
  grandTotalIncome = 0;
  grandTotalDiamonds = 0;

  monthTotalIncome = 0;
  monthTotalDiamonds = 0;
  isLoading = true;

  // Properties for the table's scrollability
  tableScrollConfig = { y: 'calc(100svh - 360px)' };

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId()!;
    if (this.userId) {
      this.loadDynamicDataForMonth();
    }
  }

  onDateChange(): void {
    this.loadDynamicDataForMonth();
  }

  changeMonth(amount: number): void {
    this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + amount));
    this.onDateChange();
  }



  loadDynamicDataForMonth(): void {
    this.isLoading = true;
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;

    this.firestoreService.getAllPriceTiers(this.userId).pipe(
      switchMap(allTiers => {
        // Now that we have all possible tiers, get the logs for the month
        return this.firestoreService.getLogsForMonth(this.userId, year, month).pipe(
          map(logs => ({ allTiers, logs })) // Pass both results down
        );
      })
    ).subscribe(({ allTiers, logs }) => {
      this.allLogsForMonth = logs;

      // --- DYNAMIC TIER/COLUMN LOGIC ---
      const usedArchivedTierIds = new Set<string>();
      logs.forEach(log => {
        log.entries.forEach(entry => {
          usedArchivedTierIds.add(entry.priceTierId);
        });
      });
      console.log('Used Archived Tier IDs:', usedArchivedTierIds);

      this.activeTiersForMonth = allTiers.filter(tier =>
        !tier.isArchived || usedArchivedTierIds.has(tier.id)
      ).sort((a, b) => a.price - b.price); // Sort columns by price

      // --- REAL-TIME CALCULATION ---
      this.calculateGrandTotals();

      this.isLoading = false;
    });
  }

  calculateGrandTotals(): void {
    this.grandTotalDiamonds = this.allLogsForMonth.reduce((total, log) => total + this.getDailyDiamondTotal(log), 0);
    this.grandTotalIncome = this.allLogsForMonth.reduce((total, log) => total + this.getDailyIncome(log), 0);
  }

  getDailyDiamondTotal(log: DailyLog): number {
    return log.entries.reduce((sum, entry) => sum + (entry.count || 0), 0);
  }

  getDailyIncome(log: DailyLog): number {
    return log.entries.reduce((sum, entry) => {
      const tier = this.activeTiersForMonth.find(t => t.id === entry.priceTierId);
      const price = tier?.price || 0;
      return sum + ((entry.count || 0) * price);
    }, 0);
  }


  // --- ACTION HANDLERS ---
  editLog(log: DailyLog): void {
    // Navigate to the edit screen, passing the YYYY-MM-DD date as a parameter
    const dateStr = log.id!;
    this.router.navigate(['/log/edit', dateStr]);
  }

  deleteLog(log: DailyLog): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this log?',
      nzContent: `This will permanently remove the entry for <strong>${log.date.toDate().toLocaleDateString()}</strong>.`,
      nzOkText: 'Yes, Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.firestoreService.deleteDailyLog(this.userId, log.id!).subscribe(() => {
          // No need to manually refetch; the stream will update automatically.
        });
      },
    });
  }

  // Helper to find the diamond count for a specific tier in a specific log
  getDiamondCountForTier(log: DailyLog, tierId: string): number {
    return log.entries.find(e => e.priceTierId === tierId)?.count || 0;
  }
}
