import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/services/auth.service';

// --- Custom Validator Function ---
// This function checks if two form fields have the same value.
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // If controls haven't been created yet, or if they don't have values, don't validate.
  if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
    return null;
  }

  // If passwords match, return null (no error). Otherwise, return an error object.
  return password.value === confirmPassword.value ? null : { passwordsMismatch: true };
};


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [NzMessageService],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      // Add our custom validator to the whole form group
      validators: passwordMatchValidator
    });
  }

  submitForm(): void {
    // Mark all fields as touched to trigger validation messages
    Object.values(this.signupForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });

    if (this.signupForm.invalid) {
      return;
    }

    const { email, password } = this.signupForm.value;

    this.authService.signup(email, password).subscribe({
      next: () => {
        this.message.success('Account created successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Provide a user-friendly error message
        if (err.code === 'auth/email-already-in-use') {
          this.message.error('This email address is already in use.');
        } else {
          this.message.error(err.message);
        }
      }
    });
  }
}