import { Component, OnInit, ViewChild } from '@angular/core';
import {SharedService} from '../shared.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgForm }   from '@angular/forms';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
    
    
    toggleLoadMore: boolean = false;
    responseDoc: boolean = false;
    
    @ViewChild('addContactModal', { static: false }) private addContactModal : any;

    
    public imagePath: string;
    imgURL: any = "assets/images/contacts/user.jpg";
    public message: string;
    
    public c_name: string;
    public c_index: string;
    public c_contact_type: string;
    public c_occupation: string;
    public c_file: any;
    public modalReference : any;
    
    cNameError: boolean = false;
    cOccupationError: boolean = false;
    
    
    preview(files: any) {
        if (files.length === 0)
        return;
        
        var mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = "Only images are supported.";
            return;
        }
        
        var reader = new FileReader();
        this.imagePath = files;
        reader.readAsDataURL(files[0]); 
        reader.onload = (_event) => { 
            this.imgURL = reader.result; 
        }
    }
    
    
    constructor(private sharedService: SharedService, private modalService: NgbModal) { }
    
    ngOnInit(): void {
    }
    
    open(modelId:any) {
        this.imgURL = "assets/images/contacts/user.jpg";
        this.c_name = "";
        this.c_occupation = "";
        this.c_file = "";
		this.modalReference =  this.modalService.open(modelId);
        
    }
    
    
    allContacts = this.sharedService.allContacts;
    pendingContacts = this.sharedService.pendingContacts;
    
    add_contact(contactType:any) {
        this.toggleLoadMore = true;
        this.responseDoc = this.sharedService.add_contact(contactType);
        
        setTimeout(() => this.toggleLoadMore = false, 1000);
        
        // if(this.responseDoc) {
        // }
    }
    
    onSubmit(contactForm: NgForm) {
        const bg = this.imgURL;
        const uploadedUserImage = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
        
        if(contactForm.value.c_name == "" || contactForm.value.c_name =="undefined") {
            this.cNameError = true;
        }
        const index = contactForm.value.c_index;
        const contactType = contactForm.value.c_contact_type;
        if(!this.cOccupationError && !this.cNameError) {
            const contactDetail = {
                image:uploadedUserImage,
                name:contactForm.value.c_name,
                post:contactForm.value.c_occupation,
                message_url:"admin/messages",
                url: "admin/app-profile",
            }
            
            this.sharedService.createContacts(contactDetail, index, contactType);
            
            this.modalReference.close();
        }
    }
    
    
    deleteContact(contactId: any, contactType:any) {
        this.sharedService.deleteContact(contactId, contactType);
    }
    
    
    openEditpopup(contactId: any, contactType:any) {
        this.c_index = contactId;
        this.c_contact_type = contactType;
        
        if(contactType =='all') {
            this.imgURL = this.allContacts[contactId]['image'];
            this.c_name = this.allContacts[contactId]['name'];
            this.c_occupation = this.allContacts[contactId]['post'];
            this.c_file = "";
        } else {
            this.imgURL = this.pendingContacts[contactId]['image'];
            this.c_name = this.pendingContacts[contactId]['name'];
            this.c_occupation = this.pendingContacts[contactId]['post'];
            this.c_file = "";
        
        }
        this.modalReference = this.modalService.open(this.addContactModal);
        

    }
    
}
