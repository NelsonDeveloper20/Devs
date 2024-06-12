import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.css']
})
export class SwitcherComponent implements OnInit {


  themename: string;
  themedir: string;
  attributeVal: any;
  event: Event;
  
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
      
      this.route.queryParams
      .subscribe(params => { 
        
        if(params.direction =="undefined" || params.direction == "" || params.direction == null) {
            this.themedir = 'ltr';
        } else {
            this.themedir = params.direction;
        }
        
        if(params.themename !="" && (params.themename <= 5 && params.themename > 0)) {
            this.themename = 'dezThemeSet'+params.themename;
            this.themeDemoSettings(this.themename, this.themedir);
        } 
      });
  }
  
  
    toggleswitcher: boolean = true;
    togglesthemedemo: boolean = true;
  
    toggleswitcherwindow() {
		this.toggleswitcher = !this.toggleswitcher;
	}
    
    togglesthemedemowindow() {
		this.togglesthemedemo = !this.togglesthemedemo;
	}
    
    
    // themeSettings(attributeName: any, attributeVal: any) {
    themeSettings(attributeName: any, event: any) {
     
        if(event.target === undefined) {
            this.attributeVal = event;
        } else {
            this.attributeVal = event.target.value;
        }
    
    
    
        document.body.setAttribute(attributeName, this.attributeVal);
        
        
        if(attributeName == 'direction') {
            document.getElementsByTagName('html')[0].setAttribute('dir', this.attributeVal);
            document.getElementsByTagName('html')[0].setAttribute('class', this.attributeVal);
        }
    }
    
    
    themeDemoSettings (theme: any, direction: any) {
    
    
        var dezThemeSet1 = {
            typography: "poppins",
            version: "light",
            layout: "vertical",
            primary: "color_5",
            headerBg: "color_5",
            navheaderBg: "color_1",
            sidebarBg: "color_1",
            sidebarStyle: "mini",
            sidebarPosition: "static",
            headerPosition: "fixed",
            containerLayout: "full",
            direction: direction
        };
        
        var dezThemeSet2 = {
            typography: "poppins",
            version: "dark",
            layout: "vertical",
            primary: "color_14",
            headerBg: "color_1",
            navheaderBg: "color_8",
            sidebarBg: "color_8",
            sidebarStyle: "full",
            sidebarPosition: "fixed",
            headerPosition: "fixed",
            containerLayout: "full",
            direction: direction
        };
        
        
        var dezThemeSet3 = {
            typography: "poppins",
            version: "light",
            layout: "vertical",
            primary: "color_2",
            headerBg: "color_1",
            navheaderBg: "color_2",
            sidebarBg: "color_2",
            sidebarStyle: "full",
            sidebarPosition: "fixed",
            headerPosition: "fixed",
            containerLayout: "full",
            direction: direction
        };
        
        var dezThemeSet4 = {
            typography: "poppins",
            version: "dark",
            layout: "vertical",
            primary: "color_7",
            headerBg: "color_1",
            navheaderBg: "color_7",
            sidebarBg: "color_7",
            sidebarStyle: "compact",
            sidebarPosition: "fixed",
            headerPosition: "fixed",
            containerLayout: "full",
            direction: direction
        };
        
        var dezThemeSet5 = {
            typography: "poppins",
            version: "light",
            layout: "vertical",
            primary: "color_4",
            headerBg: "color_1",
            navheaderBg: "color_4",
            sidebarBg: "color_4",
            sidebarStyle: "icon-hover",
            sidebarPosition: "fixed",
            headerPosition: "fixed",
            containerLayout: "full",
            direction: direction
        };
        var themeVar = eval(theme);
        
         document.body.setAttribute('data-typography', themeVar.typography);
         document.body.setAttribute('data-theme-version', themeVar.version);
         document.body.setAttribute('data-layout', themeVar.layout);
         document.body.setAttribute('data-primary', themeVar.primary);
         document.body.setAttribute('data-headerbg', themeVar.headerBg);
         document.body.setAttribute('data-nav-headerbg', themeVar.navheaderBg);
         document.body.setAttribute('data-sibebarbg', themeVar.sidebarBg);
         document.body.setAttribute('data-sidebar-style', themeVar.sidebarStyle);
         document.body.setAttribute('data-sidebar-position', themeVar.sidebarPosition);
         document.body.setAttribute('data-header-position', themeVar.headerPosition);
         document.body.setAttribute('data-container', themeVar.containerLayout);
         document.body.setAttribute('direction', direction);
            
        document.getElementsByTagName('html')[0].setAttribute('dir', direction);
        document.getElementsByTagName('html')[0].setAttribute('class', direction);

    
    
    }
    

}
