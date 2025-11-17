import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  constructor(private router: Router) {}

  logout() {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('UserAuth');
    } catch {}
    this.router.navigate(['/login']);
  }
}
