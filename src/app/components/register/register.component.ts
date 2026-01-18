import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  /**
   * Initialize form with validation rules
   */
  private initializeForm(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+84|0)[0-9]{9,10}$/)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Get form controls for template
   */
  get f() {
    return this.registerForm.controls;
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Check field validation for error display
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Get error message for field
   */
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);

    if (!field || !field.errors || !field.dirty) {
      return '';
    }

    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} là bắt buộc`;
    }

    if (field.hasError('email')) {
      return 'Email không hợp lệ';
    }

    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength')?.requiredLength;
      return `${this.getFieldLabel(fieldName)} phải có ít nhất ${minLength} ký tự`;
    }

    if (field.hasError('maxlength')) {
      const maxLength = field.getError('maxlength')?.requiredLength;
      return `${this.getFieldLabel(fieldName)} không vượt quá ${maxLength} ký tự`;
    }

    if (field.hasError('pattern')) {
      if (fieldName === 'phoneNumber') {
        return 'Số điện thoại không hợp lệ. Vui lòng nhập số Việt Nam (0xxxxxxxxx hoặc +84xxxxxxxxx)';
      }
      if (fieldName === 'password') {
        return 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)';
      }
    }

    return '';
  }

  /**
   * Get friendly field label
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      fullName: 'Họ và tên',
      email: 'Email',
      phoneNumber: 'Số điện thoại',
      username: 'Tài khoản',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Submit registration form
   */
  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    const formData: RegisterRequest = {
      fullName: this.registerForm.value.fullName,
      email: this.registerForm.value.email,
      phoneNumber: this.registerForm.value.phoneNumber,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Đăng ký thành công! Chuyển hướng...';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      }
    });
  }

  /**
   * Login with Google OAuth
   */
  loginWithGoogle(): void {
    // This will be implemented with Google OAuth library (e.g., @react-oauth/google)
    // For now, this is a placeholder
    alert('Google login sẽ được kích hoạt sau khi cấu hình Google OAuth');
    
    // Example implementation:
    // this.authService.loginWithGoogle({ googleToken: token }).subscribe({...});
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    this.router.navigate(['/dang-nhap']);
  }
}
