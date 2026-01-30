import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  user: User | null = null;
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    public permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authenticated$.subscribe((auth) => {
      this.isAuthenticated = auth;
    });
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.mobileMenuOpen = false;
    this.router.navigate(['/']);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}