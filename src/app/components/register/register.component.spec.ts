import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../shared/services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [AuthService]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize register form with empty values', () => {
    expect(component.registerForm.get('fullName')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('phoneNumber')?.value).toBe('');
    expect(component.registerForm.get('username')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate password strength', () => {
    const passwordControl = component.registerForm.get('password');
    // Weak password
    passwordControl?.setValue('weak');
    expect(passwordControl?.hasError('pattern')).toBeTruthy();

    // Strong password
    passwordControl?.setValue('Strong@123');
    expect(passwordControl?.hasError('pattern')).toBeFalsy();
  });

  it('should validate password confirmation', () => {
    component.registerForm.patchValue({
      password: 'Strong@123',
      confirmPassword: 'Different@123'
    });
    expect(component.registerForm.hasError('passwordMismatch')).toBeTruthy();

    component.registerForm.patchValue({
      confirmPassword: 'Strong@123'
    });
    expect(component.registerForm.hasError('passwordMismatch')).toBeFalsy();
  });

  it('should validate phone number format', () => {
    const phoneControl = component.registerForm.get('phoneNumber');
    phoneControl?.setValue('123');
    expect(phoneControl?.hasError('pattern')).toBeTruthy();

    phoneControl?.setValue('0123456789');
    expect(phoneControl?.hasError('pattern')).toBeFalsy();

    phoneControl?.setValue('+84123456789');
    expect(phoneControl?.hasError('pattern')).toBeFalsy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalsy();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTruthy();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalsy();
  });

  it('should disable submit button when form is invalid', () => {
    expect(component.registerForm.invalid).toBeTruthy();
    // Form should be invalid initially
  });
});
