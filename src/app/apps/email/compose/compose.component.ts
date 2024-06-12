import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.css']
})
export class ComposeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  
  files: File[] = [];

	onSelect(event: any) { 
		this.files.push(...event.addedFiles);
	}

	onRemove(event: any) { 
		this.files.splice(this.files.indexOf(event), 1);
	}

}
