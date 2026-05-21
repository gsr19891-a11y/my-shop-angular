import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'

@Component({
  selector: 'app-error-page',
  imports: [],
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss',
})
export class ErrorPage {
  constructor(private router: Router, private location: Location) {}

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.location.back();
  }

}
