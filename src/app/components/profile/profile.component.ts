import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { PermissionService } from '../../shared/services/permission.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  standalone: true,
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = true;

  constructor(
    private authService: AuthService,
    public permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.isLoading = false;
      if (!user) {
        this.router.navigate(['/dang-nhap']);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
