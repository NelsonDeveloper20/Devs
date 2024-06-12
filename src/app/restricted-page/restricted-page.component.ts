import { Component, OnInit } from '@angular/core';
 

@Component({
  selector: 'app-restricted-page',
  templateUrl: './restricted-page.component.html',
  styleUrls: ['./restricted-page.component.css']
})
export class RestrictedPageComponent implements OnInit {


  constructor( ) { }

  getName () : string { 
    return "";
  }

  ngOnInit(): void {
  }

}
