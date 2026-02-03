import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { RegisterRequest, LoginRequest, AuthResponse } from '../../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register user successfully', () => {
    const mockData: RegisterRequest = {
      fullName: 'Test User',
      email: 'test@example.com',
      phoneNumber: '0123456789',
      username: 'testuser',
      password: 'TestPass@123'
    };

    const mockResponse: AuthResponse = {
      success: true,
      message: 'Registration successful',
      token: 'test-token',
      refreshToken: 'test-refresh-token',
      user: {
        id: '1',
        fullName: 'Test User',
        email: 'test@example.com',
        phoneNumber: '0123456789',
        username: 'testuser',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    service.register(mockData).subscribe(response => {
      expect(response.success).toBeTruthy();
      expect(service.getToken()).toBe('test-token');
    });

    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should login user successfully', () => {
    const mockData: LoginRequest = {
      username: 'testuser',
      password: 'TestPass@123'
    };

    const mockResponse: AuthResponse = {
      success: true,
      message: 'Login successful',
      token: 'test-token',
      user: {
        id: '1',
        fullName: 'Test User',
        email: 'test@example.com',
        phoneNumber: '0123456789',
        username: 'testuser',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    service.login(mockData).subscribe(response => {
      expect(response.success).toBeTruthy();
      expect(service.isAuthenticated()).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should store token in localStorage after successful login', () => {
    const mockData: LoginRequest = {
      username: 'testuser',
      password: 'TestPass@123'
    };

    const mockResponse: AuthResponse = {
      success: true,
      message: 'Login successful',
      token: 'test-token',
      user: {
        id: '1',
        fullName: 'Test User',
        email: 'test@example.com',
        phoneNumber: '0123456789',
        username: 'testuser',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    service.login(mockData).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/login`);
    req.flush(mockResponse);

    expect(localStorage.getItem('auth_token')).toBe('test-token');
  });

  it('should logout and clear tokens', () => {
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('current_user', JSON.stringify({ id: '1', username: 'testuser' }));

    service.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('current_user')).toBeNull();
    expect(service.isAuthenticated()).toBeFalsy();
  });

  it('should check authentication status', () => {
    expect(service.isAuthenticated()).toBeFalsy();

    localStorage.setItem('auth_token', 'test-token');
    expect(service.isAuthenticated()).toBeTruthy();

    service.logout();
    expect(service.isAuthenticated()).toBeFalsy();
  });
});
