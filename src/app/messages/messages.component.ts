import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  
  allMessage = [
        {
            image: "assets/images/profile/Untitled-2.jpg",
            name: "Olivia Rellaq",
            time: "25m ago",
            description:"Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            active_class:''
        },
        {
            image: "assets/images/profile/Untitled-3.jpg",
            name: "Roberto Charloz",
            time: "2m ago",
            description:"Hey, check my design update last night. Tell me what you think and if that is OK. I hear client said they want to change the layout concept",
            active_class:'active'            
        },
        {
            image: "assets/images/profile/Untitled-1.jpg",
            name: "Laura Chyan",
            time: "5m ago",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
            active_class:'active'
        },
        {
            image: "assets/images/profile/Untitled-2.jpg",
            name: "Keanu Tipes",
            time: "41m ago",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
            active_class:'active'
        },
        {
            image: "assets/images/profile/Untitled-3.jpg",
            name: "Olivia Rellaq",
            time: "25m ago",
            description:"Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            active_class:'active'
        },
        {
            image: "assets/images/profile/Untitled-2.jpg",
            name: "Olivia Rellaq",
            time: "25m ago",
            description:"Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            active_class:'active'
        },
    ];
    
    unreadMessage = [
        {
            image: "assets/images/profile/Untitled-1.jpg",
            name: "Roberto Charloz",
            time: "2m ago",
            description:"Hey, check my design update last night. Tell me what you think and if that is OK. I hear client said they want to change the layout concept",
            active_class:'active'
        },
        {
            image: "assets/images/profile/Untitled-2.jpg",
            name: "Keanu Tipes",
            time: "41m ago",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
            active_class:'active'            
        },
        {
            image: "assets/images/profile/Untitled-2.jpg",
            name: "Olivia Rellaq",
            time: "25m ago",
            description:"Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            active_class:'active'
        },
        {
            image: "assets/images/profile/Untitled-3.jpg",
            name: "Olivia Rellaq",
            time: "25m ago",
            description:"Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            active_class:'active'
        },
    ];
    
    archivedMessage = [
        {
            image: "assets/images/profile/Untitled-1.jpg",
            name: "Laura Chyan",
            time: "5m ago",
            description:"Hey, check my design update last night. Tell me what you think and if that is OK. I hear client said they want to change the layout concept",
            active_class:'active'
        },
        {
            image: "assets/images/profile/Untitled-2.jpg",
            name: "Keanu Tipes",
            time: "41m ago",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
            active_class:'active'            
        },
        {
            image: "assets/images/profile/Untitled-3.jpg",
            name: "Olivia Rellaq",
            time: "25m ago",
            description:"Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            active_class:'active'
        },
        {
            image: "assets/images/profile/Untitled-1.jpg",
            name: "Olivia Rellaq",
            time: "25m ago",
            description:"Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            active_class:'active'
        },
    ];


}
