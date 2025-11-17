import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Footer } from "../footer/footer";
import {RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-outlet',
  imports: [Navbar, Footer , RouterOutlet],
  templateUrl: './main-outlet.html',
  styleUrl: './main-outlet.scss'
})
export class MainOutlet {

}
