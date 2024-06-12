import { Component, OnInit ,ViewChild} from '@angular/core'; 
import { filter } from 'rxjs/operators';
import {SharedService} from '../shared.service';

//main

import { MatSidenav } from '@angular/material/sidenav';
import { AzureAdDemoService } from '../azure-ad-demo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //main 
  isUserLoggedIn:boolean=false;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  loginDisplay = false;
  hamburgerClass: boolean = false;
  constructor( private azureAdDemoService:AzureAdDemoService
    ) { }

  ngOnInit(): void {
  /*
    this.azureAdDemoService.isUserLoggedIn.subscribe(x=>{
      this.isUserLoggedIn=x;
    });*/
  }

  setLoginDisplay() { 
  }
  //menu
  
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

}
