import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import * as AOS from 'aos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements AfterViewInit {
  ngAfterViewInit(): void {
    if (AOS) {
      AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-in-out',
      });
    }
  }
}
