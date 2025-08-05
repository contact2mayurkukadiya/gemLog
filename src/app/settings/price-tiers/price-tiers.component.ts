import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FirestoreService } from '../../core/services/firestore.service';
import { AuthService } from '../../core/services/auth.service';
import { PriceTier } from '../../core/models/gem-log.models';
import { SharedModule } from '../../shared/shared.module';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-price-tiers',
  imports: [SharedModule],
  templateUrl: './price-tiers.component.html',
  styleUrls: ['./price-tiers.component.scss']
})
export class PriceTiersComponent implements OnInit {
  priceForm: FormGroup;
  isLoading = true;
  userId: string;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    this.priceForm = this.fb.group({
      tiers: this.fb.array([]),
    });
    // Ensure we have a user ID before doing anything else
    this.userId = this.authService.getCurrentUserId()!;
    if (!this.userId) {
      this.message.error("User not found, please log in again.");
    }
  }

  ngOnInit(): void {
    this.loadTiers();
  }

  // Helper getter for easy access in the template
  get tiers(): FormArray {
    return this.priceForm.get('tiers') as FormArray;
  }

  // Load existing price tiers from Firestore
  loadTiers(): void {
    if (!this.userId) return;

    this.firestoreService.getPriceTiers(this.userId).subscribe(tiers => {
      this.tiers.clear();

      if (tiers && tiers.length > 0) {
        tiers.forEach(tier => {
          this.tiers.push(this.createTierGroup(tier));
        });
      } else {
        this.tiers.push(this.createTierGroup());
      }
      this.isLoading = false;
    });
  }

  // Creates a FormGroup for a single tier
  createTierGroup(tier?: PriceTier): FormGroup {
    return this.fb.group({
      id: [tier?.id || null],
      weight: [tier?.weight ?? '', Validators.required],
      sieve: [tier?.sieve ?? ''],
      price: [tier?.price ?? 0, tier?.id ? null : [Validators.required, Validators.min(0)]],
    });
  }


  // Adds a new, empty tier to the FormArray
  addNewTierRow(): void {
    this.tiers.push(this.createTierGroup());
  }

  archiveTier(index: number): void {
    const tierToDelete = this.tiers.at(index);
    const tierId = tierToDelete.get('id')?.value;
    console.log(`Archiving tier with ID: ${tierId}`);
    // CASE 1: The row is new and not yet in Firestore (no ID).
    // Just remove it from the form array without showing a modal.
    if (!tierId) {
      this.tiers.removeAt(index);
      return;
    }

    // CASE 2: The row exists in Firestore. Show a confirmation modal.
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this price tier?',
      nzContent: 'This action cannot be undone. Any historical logs will still keep their price, but you cannot add new logs with this tier.',
      nzOkText: 'Yes, Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        // This code runs when the user clicks "Yes, Delete"
        this.firestoreService.archivePriceTier(this.userId, tierId).subscribe({
          next: () => {
            this.message.success('Price tier deleted successfully.');
          },
          error: (err: any) => {
            this.message.error(`Failed to delete tier: ${err.message}`);
          }
        });
      },
      nzCancelText: 'Cancel',
      nzOnCancel: () => console.log('Delete canceled'),
    });
  }



  // Submits the form data to Firestore
  submitForm(): void {
    if (this.priceForm.invalid) {
      this.message.error('Please fill in all fields correctly.');
      // Mark all fields as touched to show validation errors
      this.priceForm.markAllAsTouched();
      return;
    }

    if (!this.userId) {
      this.message.error("Cannot save. User is not logged in.");
      return;
    }

    // Create PriceTier objects from the form value, using 'name' as the ID.
    const tiersToSave: PriceTier[] = this.priceForm.value.tiers.map((t: any) => ({
      id: t.id, // Will be null for new documents
      weight: t.weight,
      sieve: t.sieve,
      price: t.price
    }));

    this.firestoreService.savePriceTiers(this.userId, tiersToSave).subscribe({
      next: () => {
        this.message.success('Prices saved successfully!');
        this.loadTiers();
      },
      error: (err) => this.message.error(`Save failed: ${err.message}`),
    });
  }
}