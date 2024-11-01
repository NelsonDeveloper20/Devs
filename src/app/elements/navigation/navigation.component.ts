import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
 

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  currentHref: string = '';
  rol: number = 0;
  loginDisplay = false;

  constructor(
    location: Location,
    router: Router,
    private modalService: NgbModal,
    private authService: AuthService, 
  ) {
    router.events.subscribe((val) => {
      if (location.path() != '') {
        this.currentHref = location.path();
      } else {
        this.currentHref = '/inicio';
      }
    }); 
  }

  ngOnInit(): void {}

  toggleIcon: boolean = true;

  toggleLoveIcon() {
    this.toggleIcon = !this.toggleIcon;
  }

  open(modelId: any) {
    this.modalService.open(modelId);
  }

  setLoginDisplay() { 
  }

  dashboardArray = ['/', '/inicio', '/request'];
  adminArray = ['/admin', '/admin/users'];

  apsArray = [
    '/admin/app-profile',
    '/admin/post-details',
    '/admin/email-compose',
    '/admin/email-inbox',
    '/admin/email-read',
    '/admin/app-calender',
    '/admin/ecom-product-grid',
    '/admin/ecom-product-list',
    '/admin/ecom-product-detail',
    '/admin/ecom-product-order',
    '/admin/ecom-checkout',
    '/admin/ecom-invoice',
    '/admin/ecom-customers',
  ];

  chartsArray = [
    '/admin/chart-chartjs',
    '/admin/chart-apex',
    '/admin/apex-line',
    '/admin/apex-area',
    '/admin/apex-column',
    '/admin/apex-bar',
    '/admin/apex-mixed',
    '/admin/apex-timeline',
    '/admin/apex-candlestick',
    '/admin/apex-pie',
    '/admin/apex-radar',
    '/admin/apex-radialbar',
    '/admin/apex-polar-area',
    '/admin/apex-bubble',
    '/admin/apex-scatter',
    '/admin/apex-heatmap',
    '/admin/apex-treemap',
    '/admin/apex-sparklines',
  ];

  bootstrapArray = [
    '/admin/ui-accordion',
    '/admin/ui-alert',
    '/admin/ui-badge',
    '/admin/ui-button',
    '/admin/ui-datepicker',
    '/admin/ui-modal',
    '/admin/ui-button-group',
    '/admin/ui-list-group',
    '/admin/ui-media-object',
    '/admin/ui-card', 
    '/admin/ui-dropdown',
    '/admin/ui-popover',
    '/admin/ui-progressbar',
    '/admin/ui-nav',
    '/admin/ui-rating',
    '/admin/ui-typography',
    '/admin/ui-table',
    '/admin/ui-pagination',
    '/admin/ui-timepicker',
    '/admin/ui-toast',
    '/admin/ui-tooltip',
    '/admin/ui-typeahead',
    '/admin/ui-grid',
  ];

  materialArray = [
    '/admin/mat-autocomplete',
    '/admin/mat-badge',
    '/admin/mat-bottom-sheet',
    '/admin/mat-button',
    '/admin/mat-button-toggle',
    '/admin/mat-card',
    '/admin/mat-checkbox',
    '/admin/mat-chips',
    '/admin/mat-datepicker',
    '/admin/mat-dialog',
    '/admin/mat-divider',
    '/admin/mat-expansion',
    '/admin/mat-form-field',
    '/admin/mat-grid-list',
    '/admin/mat-icon',
    '/admin/mat-input',
    '/admin/mat-list',
    '/admin/mat-menu',
    '/admin/mat-paginator',
    '/admin/mat-progress-bar',
    '/admin/mat-progress-spinner',
    '/admin/mat-radio',
    '/admin/mat-ripple',
    '/admin/mat-select',
    '/admin/mat-sidenav',
    '/admin/mat-slide-toggle',
    '/admin/mat-slider',
    '/admin/mat-snack-bar',
    '/admin/mat-sort',
    '/admin/mat-stepper',
    '/admin/mat-table',
    '/admin/mat-tab',
    '/admin/mat-tooltip',
    '/admin/mat-tree',
    '/admin/mat-toolbar',
  ];

  pluginsArray = ['/admin/uc-nestable', '/admin/uc-lightgallery'];

  formsArray = ['/admin/form-element', '/admin/form-validate'];
}
