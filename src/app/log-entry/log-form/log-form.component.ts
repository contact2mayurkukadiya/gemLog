import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { combineLatest, of, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';
import { DailyLog, DiamondEntry, PriceTier } from '../../core/models/gem-log.models';
import { FirestoreService } from '../../core/services/firestore.service';
import { AuthService } from '../../core/services/auth.service';
import { SharedModule } from '../../shared/shared.module';
import { NzModalRef } from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-log-form',
  imports: [SharedModule],
  templateUrl: './log-form.component.html',
  styleUrls: ['./log-form.component.scss']
})
export class LogFormComponent implements OnInit, OnDestroy {
  logForm: FormGroup;
  priceTiers: PriceTier[] = [];
  logDate: Date = new Date();
  isLoading = true;
  isEditMode = false;
  userId: string;
  totalDiamonds = 0;
  totalIncome = 0;

  private valueChangesSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private message: NzMessageService,
    @Optional() private modalRef: NzModalRef
  ) {
    this.userId = this.authService.getCurrentUserId()!;
    this.logForm = this.fb.group({
      entries: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const dateParam = this.route.snapshot.paramMap.get('date');
    if (dateParam) {
      this.isEditMode = true;
      this.logDate = new Date(dateParam);
    }
    this.logDate.setHours(0, 0, 0, 0); // Normalize date to start of day

    this.loadData();
  }

  loadData() {
    const logDateStr = this.logDate.toISOString().split('T')[0];

    // Fetch price tiers and any existing log for the date at the same time
    combineLatest([
      this.firestoreService.getPriceTiers(this.userId).pipe(take(1)),
      this.firestoreService.getLogForDate(this.userId, logDateStr).pipe(take(1))
    ]).subscribe(([tiers, log]) => {
      if (!tiers || tiers.length === 0) {
        this.message.error('Please set up price tiers in Settings first.');
        this.router.navigate(['/settings']);
        return;
      }

      this.priceTiers = tiers;
      this.buildForm(log);
      this.isLoading = false;
    });
  }

  buildForm(existingLog: DailyLog | null) {
    this.priceTiers.forEach(tier => {
      // Find if an entry for this tier already exists in the log
      const existingEntry = existingLog?.entries.find(e => e.priceTierId === tier.id);
      this.entries.push(this.createEntryGroup(tier, existingEntry));
    });

    this.setupValueChanges();
    this.calculateTotals();
  }

  // Helper getters
  get entries(): FormArray {
    return this.logForm.get('entries') as FormArray;
  }

  createEntryGroup(tier: PriceTier, existingEntry: DiamondEntry | undefined): FormGroup {
    return this.fb.group({
      priceTierId: [tier.id],
      tierName: [tier.name], // For display only
      priceAtTime: [tier.price], // For calculation
      count: [existingEntry?.count || 0],
    });
  }

  setupValueChanges() {
    this.valueChangesSub = this.logForm.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
  }

  calculateTotals() {
    let diamonds = 0;
    let income = 0;
    this.entries.controls.forEach(control => {
      const entryValue = control.value;
      const count = Number(entryValue.count) || 0;
      const price = Number(entryValue.priceAtTime) || 0;
      diamonds += count;
      income += count * price;
    });
    this.totalDiamonds = diamonds;
    this.totalIncome = income;
  }

  submitForm(): void {
    const formValues = this.logForm.value.entries;

    const logToSave: DailyLog = {
      date: Timestamp.fromDate(this.logDate),
      userId: this.userId,
      entries: formValues.map((e: any) => ({
        priceTierId: e.priceTierId,
        count: Number(e.count) || 0,
        priceAtTime: e.priceAtTime
      })),
      totalDiamonds: this.totalDiamonds,
      totalIncome: this.totalIncome,
    };

    this.firestoreService.saveDailyLog(this.userId, logToSave).subscribe({
      next: () => {
        this.message.success(`Log for ${this.logDate.toLocaleDateString()} saved!`);
        if (this.modalRef) {
          this.modalRef.close();
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: any) => this.message.error(err.message)
    });
  }

  ngOnDestroy(): void {
    if (this.valueChangesSub) {
      this.valueChangesSub.unsubscribe();
    }
  }
}