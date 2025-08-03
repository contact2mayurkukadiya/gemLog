import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FirestoreService } from '../../core/services/firestore.service';
import { AuthService } from '../../core/services/auth.service';
import { PriceTier } from '../../core/models/gem-log.models';
import { SharedModule } from '../../shared/shared.module';

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
    private message: NzMessageService
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
      // Clear existing form array controls before loading new ones
      while (this.tiers.length) {
        this.tiers.removeAt(0);
      }

      if (tiers && tiers.length > 0) {
        tiers.forEach(tier => this.tiers.push(this.createTierGroup(tier.name, tier.price)));
      } else {
        // If no tiers exist, start with one empty row
        this.addTier();
      }
      this.isLoading = false;
    });
  }

  // Creates a FormGroup for a single tier
  createTierGroup(name: string, price: number): FormGroup {
    // Note: The 'id' will be based on the name. For this design, let's assume 'name' is the ID.
    return this.fb.group({
      name: [name, Validators.required],
      price: [price, [Validators.required, Validators.min(0)]],
    });
  }

  // Adds a new, empty tier to the FormArray
  addTier(): void {
    this.tiers.push(this.createTierGroup('', 0));
  }

  // Removes a tier from the FormArray at a given index
  removeTier(index: number): void {
    this.tiers.removeAt(index);
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
      id: t.name.replace(/\s+/g, '-'), // Creates a simple ID like '1-20'
      name: t.name,
      price: t.price
    }));

    this.firestoreService.savePriceTiers(this.userId, tiersToSave).subscribe({
      next: () => this.message.success('Prices saved successfully!'),
      error: (err: any) => this.message.error(`Save failed: ${err.message}`),
    });
  }
}