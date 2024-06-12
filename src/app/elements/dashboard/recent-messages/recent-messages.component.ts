import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recent-messages',
  templateUrl: './recent-messages.component.html',
  styleUrls: ['./recent-messages.component.css']
})
export class RecentMessagesComponent implements OnInit {

  @Input() data:any

  constructor() { }

  ngOnInit(): void {
  }

}
