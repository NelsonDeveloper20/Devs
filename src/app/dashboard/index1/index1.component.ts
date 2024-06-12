import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index1',
  templateUrl: './index1.component.html',
  styleUrls: ['./index1.component.css']
})
export class Index1Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  dashboardWidgets = [
        {
          total_no: "78",
          image:"assets/images/svg/ic_star.svg",
          description: "Total Project Handled",
          border_class: "bg-secondary",
        },
        {
          total_no: "214",
          image:"assets/images/svg/ic_person.svg",
          description: "Contacts You Have",
          border_class: "bg-warning",
        },
        {
          total_no: "93",
          image:"assets/images/svg/ic_kanban.svg",
          description: "Total Unfinished Task",
          border_class: "bg-primary",
        },
        {
          total_no: "12",
          image:"assets/images/svg/ic_messages.svg",
          description: "Unread Messages",
          border_class: "bg-info",
        },
  ];
  
  upcomingProjects = [
        {
          title: "Redesign Kripton Mobile App",
          date:"Sep 8th, 2020",
          deadline: "Tuesday,  Sep 29th 2020",
          url: "admin/post-details",
        },
        {
          title: "Build Branding Persona for Etza.id",
          date:"Sep 8th, 2020",
          deadline: "Tuesday,  Sep 29th 2020",
          url: "admin/post-details",
        },
        {
          title: "Manage SEO for Eclan Company Profile",
          date:"Sep 8th, 2020",
          deadline: "Tuesday,  Sep 29th 2020",
          url: "admin/post-details",
        },
  ];
  
  recentMessages = [
        {
          name: "Laura Chyan",
          image:"assets/images/profile/Untitled-1.jpg",
          dedescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
          time_ago: "5m ago",
          active_class:"active",
          url: "admin/messages",
        },
        {
          name: "Olivia Rellaq",
          image:"assets/images/profile/Untitled-2.jpg",
          dedescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
          time_ago: "25m ago",
          active_class:"",
          url: "admin/messages",
        },
        {
          name: "Keanu Tipes",
          image:"assets/images/profile/Untitled-3.jpg",
          dedescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
          time_ago: "41m ago",
          active_class:"active",
          url: "admin/messages",
        },
  ];
  
  
  activity = [
        {
          post: "Graphic Deisgner",
          description: "Visual Graphic for Presentation to Client",
          date: "Aug 4, 2021",
          url: "admin/post-details",
		  user_images: [
            {
              image: "assets/images/profile/Untitled-4.jpg",
            },
            {
              image: "assets/images/profile/Untitled-5.jpg",
            },
            {
              image: "assets/images/profile/Untitled-5.jpg",
            },
            {
              image: "assets/images/profile/Untitled-7.jpg",
            },
          ],
        },
        {
          post: "Database Engineer",
          description: "Build Database Design for Fasto Admin v2",
          date: "Aug 4, 2021",
          url: "admin/post-details",
		  user_images: [
            {
              image: "assets/images/profile/Untitled-4.jpg",
            },
            {
              image: "assets/images/profile/Untitled-5.jpg",
            },
            {
              image: "assets/images/profile/Untitled-6.jpg",
            },
          ],
        },
        {
          post: "Digital Marketing",
          description: "Make Promotional Ads for Instagram Fasto’s",
          date: "Aug 4, 2021",
          url: "admin/post-details",
		  user_images: [
            {
              image: "assets/images/profile/Untitled-4.jpg",
            },
            {
              image: "assets/images/profile/Untitled-5.jpg",
            },
            {
              image: "assets/images/profile/Untitled-6.jpg",
            },
          ],
        },
    ];

}
