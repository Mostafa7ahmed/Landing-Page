import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Navbar } from './Layout/navbar/navbar';
import { Footer } from './Layout/footer/footer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  showChrome = true;

  constructor(private router: Router) {
    this.updateChrome(this.router.url || '');
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.updateChrome(e.urlAfterRedirects || e.url);
      });
  }

  private updateChrome(url: string) {
    this.showChrome = !/^\/admin(\/|$)?/.test(url);
  }
}
