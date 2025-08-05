import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { combineLatest, of, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';
import { DailyLog, DiamondEntry, PriceTier } from '../../core/models/gem-log.models';
import { FirestoreService } from '../../core/services/firestore.service';
import { AuthService } from '../../core/services/auth.service';
import { SharedModule } from '../../shared/shared.module';
import { NzModalRef } from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-log-form',
  imports: [SharedModule, FormsModule],
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
  currentDate = new Date();



  private valueChangesSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private message: NzMessageService
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
    this.loadDataForSelectedDate();
  }

  loadDataForSelectedDate(): void {
    this.isLoading = true;
    if (this.valueChangesSub) this.valueChangesSub.unsubscribe();
    const dateStr = this.formatDate(this.logDate);

    combineLatest([
      this.isEditMode ?
        this.firestoreService.getAllPriceTiers(this.userId) :
        this.firestoreService.getPriceTiers(this.userId),
      this.firestoreService.getLogForDate(this.userId, dateStr)
    ]).subscribe(([tiers, log]) => {
      this.priceTiers = tiers;
      this.buildForm(log);
      this.isLoading = false;
    });
  }

  buildForm(existingLog: DailyLog | null) {
    this.entries.clear();
    this.priceTiers.forEach(tier => {
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
      tierName: [tier.price],
      priceAtTime: [tier.price],
      count: [existingEntry?.count || 0],
    });
  }

  setupValueChanges(): void {
    this.valueChangesSub = this.logForm.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    let diamonds = 0;
    let income = 0;
    this.entries.controls.forEach((control, index) => {
      const entryValue = control.value;
      const count = Number(entryValue.count) || 0;
      const tierPrice = this.priceTiers[index]?.price || 0;
      diamonds += count;
      income += count * tierPrice;
    });
    this.totalDiamonds = diamonds;
    this.totalIncome = income;
  }

  onDateChange(): void {
    this.loadDataForSelectedDate();
  }

  changeDay(amount: number): void {
    const newDate = new Date(this.logDate.setDate(this.logDate.getDate() + amount));
    this.logDate = newDate;
    this.onDateChange();
  }

  submitForm(): void {
    if (this.logForm.invalid) return;

    const formValues = this.logForm.value.entries;

    const logToSave: DailyLog = {
      date: Timestamp.fromDate(this.logDate),
      userId: this.userId,
      entries: formValues.map((e: any, index: number) => ({
        priceTierId: e.priceTierId,
        count: Number(e.count) || 0,
        priceAtTime: this.priceTiers[index]?.price || 0
      }))
    };

    this.firestoreService.saveDailyLog(this.userId, logToSave).subscribe({
      next: () => {
        this.message.success(`Log for ${this.logDate.toLocaleDateString()} saved!`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => this.message.error(err.message)
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  ngOnDestroy(): void {
    if (this.valueChangesSub) this.valueChangesSub.unsubscribe();
  }

}