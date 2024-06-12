import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-upcoming-projects',
  templateUrl: './upcoming-projects.component.html',
  styleUrls: ['./upcoming-projects.component.css']
})
export class UpcomingProjectsComponent implements OnInit {

  @Input() data:any

  constructor() { }

  ngOnInit(): void {
  }

}
