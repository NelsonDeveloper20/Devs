import { Injectable, Output } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    
    navSidebarClass: boolean = true;
    hamburgerClass: boolean = false;
    estadoLogin: boolean=false;
    totalAllContactLength: any = 0;
    totalPendingContactLength: any = 0;
    
    constructor() { }
    
    toggleSidebarClass() {
        return this.navSidebarClass = !this.navSidebarClass  ;
    }
    toggleHamburgerClass() {
        return this.hamburgerClass = !this.hamburgerClass  ;
    }
    
    setEstadoLogin(estado:boolean) {
        this.estadoLogin  = estado;
    }
    getEstadoLogin() {
        return this.estadoLogin;
    }

    allContacts = [
        {
            image: "assets/images/contacts/Untitled-3.jpg",
            name: "Alan Green",
            post: "UI Designer",
            message_url:"admin/messages",
            url: "admin/app-profile",
        },
        {
            image: "assets/images/contacts/Untitled-1.jpg",
            name: "Angela Moss",
            post: "Redblue Studios",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-2.jpg",
            name: "Brian Samuel",
            post: "Team Management",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-4.jpg",
            name: "Benny Chagur",
            post: "Highspeed Inc.",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-5.jpg",
            name: "Chyntia Lawra",
            post: "Zero Two Studios",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-6.jpg",
            name: "Cloe Simatupang",
            post: "Zero Two Studios",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-7.jpg",
            name: "Engeline O’conner",
            post: "Beep Beep Inc.",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-8.jpg",
            name: "Franklin Jr.",
            post: "Zero Two Studios",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-9.jpg",
            name: "Geovanny",
            post: "UI Designer",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-10.jpg",
            name: "Henry Charlotte",
            post: "UI Designer",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-11.jpg",
            name: "Ivankov Shee",
            post: "UI Designer",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-12.jpg",
            name: "Nindy Leeacovic",
            post: "UI Designer",
            message_url:"admin/messages",
            url: "admin/app-profile",
        },
    ];
    
    pendingContacts = [
        {
            image: "assets/images/contacts/Untitled-7.jpg",
            name: "Engeline O’conner",
            post: "Beep Beep Inc.",
            message_url:"admin/messages",
            url: "admin/app-profile",
        },
        {
            image: "assets/images/contacts/Untitled-8.jpg",
            name: "Franklin Jr.",
            post: "Zero Two Studios",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-9.jpg",
            name: "Geovanny",
            post: "UI Designer",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-10.jpg",
            name: "Henry Charlotte",
            post: "UI Designer",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-11.jpg",
            name: "Ivankov Shee",
            post: "UI Designer",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
        {
            image: "assets/images/contacts/Untitled-12.jpg",
            name: "Nindy Leeacovic",
            post: "UI Designer",
            message_url:"admin/messages",
            url: "admin/app-profile",
            
        },
    ];
    
    
    add_contact(contactType:any) {
        if(contactType =='all') {
            
            if(this.allContacts.length <=11) {
                this.totalAllContactLength = this.allContacts.length;
            } else {
                this.totalAllContactLength = 11;
            } 
            const rndInt = Math.floor(Math.random() * this.totalAllContactLength) + 1 ;
            const contact = this.allContacts[rndInt];
            this.allContacts.push(contact);
            } else {
            
            if(this.pendingContacts.length <=5) {
                this.totalPendingContactLength = this.pendingContacts.length;
                } else {
                this.totalPendingContactLength = 5;
            } 
            const rndInt = Math.floor(Math.random() * this.totalPendingContactLength)+ 1 ;
            const contact = this.pendingContacts[rndInt];
            this.pendingContacts.push(contact);
            
        }
        return true;
    }
    
    createContacts(contactDetail: any, index:any, contactType:any) {
     
    
        if(index === undefined && contactType === undefined) {
    
            this.allContacts.unshift(contactDetail);
        } else {
            if(contactType =='all') {
                this.allContacts[index] = contactDetail;
            } else {
                this.pendingContacts[index] = contactDetail;
            }
        
        }
        return true;
    }
    
    deleteContact(contactId: any, contactType:any) {
        
        if(contactType =='all') {
            this.allContacts.splice(contactId,1);
            }else {
            this.pendingContacts.splice(contactId,1);
        }
        return true;
        
    }
    
    
}
