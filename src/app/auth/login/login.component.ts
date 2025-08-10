import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../core/services/auth.service';
import { SharedModule } from '../../shared/shared.module';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    SharedModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  passwordVisible = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe({
        next: () => {
          this.message.success('Login Successful!');
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => this.message.error('Invalid Credentials'),
      });
    }
  }
}
