import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/kanban/services/board.service';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {
  
  constructor(
    public boardService: BoardService
  ) { }

  ngOnInit(): void {
  }

  addColumn(event: any) {
    if (event) {
      this.boardService.addColumn(event)
    }
  }


}
