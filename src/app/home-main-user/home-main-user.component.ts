import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-main-user',
  templateUrl: './home-main-user.component.html',
  styleUrls: ['./home-main-user.component.css']
})
export class HomeMainUserComponent implements OnInit {
  UserAdmin=true;
  constructor() { }

  ngOnInit(): void {
  }

}
