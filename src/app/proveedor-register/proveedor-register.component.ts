import { Component, OnInit } from '@angular/core';

import {FormBuilder, Validators} from '@angular/forms';

import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ILoginIdRequest } from 'src/app/services/user.model';
import { IProveedor } from '../proveedor-register/proveedor.model'

import { FormGroup, FormControl, FormArray } from '@angular/forms'  
@Component({
  selector: 'app-proveedor-register',
  templateUrl: './proveedor-register.component.html',
  styleUrls: ['./proveedor-register.component.css']
})
export class ProveedorRegisterComponent implements OnInit {
  user!: IProveedor;   
  message: string = ''; 
  productForm: FormGroup;   
  cuentasForm: FormGroup;   
  isEditable = false;
  firstFormGroup = this._formBuilder.group({
    correoElectronico: ['', Validators.required],
    nombreProv: ['', Validators.required],
    rucProv: ['', Validators.required],
    razonSocialProv: ['', Validators.required],
    direccionProv: ['', Validators.required],
    numeroProv: ['', Validators.required],
    distritoProv: ['', Validators.required],
    provinciaProv: ['', Validators.required],
    departamentoProv: ['', Validators.required], 
    paisProv: ['', Validators.required], 
    codigoCiuProv: ['', Validators.required], 
    secondCtrl: ['', Validators.required],
    telefonoProv: ['', Validators.required],
    telefonoFijo: ['', Validators.required],
    paginaWeb: ['', Validators.required],
    
  });
  secondFormGroup = this._formBuilder.group({
    numeroDeCuentaDetraccion: ['', Validators.required],
    padronAlQuePertenece: ['', Validators.required],
    anioDeCreacion: ['', Validators.required],
    correoEletronicoIgv: ['', Validators.required]
  });
  treeFormGroup = this._formBuilder.group({ 
    moneda: ['', Validators.required],
    condicionPago: ['', Validators.required],
    creditoMontoBesco: ['', Validators.required],
    creditoMontoMiranda: ['', Validators.required]
  });
  isLinear = false;
  constructor(private fb:FormBuilder,
    private userService: UserService, //api 
    private router: Router,private _formBuilder: FormBuilder) { 
      this.productForm = this.fb.group({  
        name: 'Contactos',  
        quantities: this.fb.array([]) ,  
      });  
      this.cuentasForm = this.fb.group({  
        name: 'Cuentas',  
        contenidocuentas: this.fb.array([]) ,  
      });
    }

  ngOnInit(): void {
   this.GetProveedor();
   this.addQuantity();
   this.addCuentaBancaria();
  }
  quantities() : FormArray {  
    return this.productForm.get("quantities") as FormArray  
  }  
  contenidocuentas() : FormArray {  
    return this.cuentasForm.get("contenidocuentas") as FormArray  
  }  
    
  newQuantity(): FormGroup {  
    return this.fb.group({  
      nombre: '',  
      apellido: '',  
      correo:'',
      celular:''
    })  
  }  
  newCuentas(): FormGroup {  
    return this.fb.group({  
      banco: '',  
      cuentabancaria: '',  
      cci:'',
      padron:'',      
      anio:'',      
      correo:''
    })  
  } 
  addQuantity() {  
    this.quantities().push(this.newQuantity());  
  }  
  addCuentaBancaria() {  
    this.contenidocuentas().push(this.newCuentas());  
  }   
  removeQuantity(i:number) {  
    this.quantities().removeAt(i);  
  }  
     
  removecuentasy(i:number) {  
    this.contenidocuentas().removeAt(i);  
  }  
  onSubmit() {   
  }  
  creditBesco(event: Event){ 
    const filtro= (event.target as HTMLInputElement).value;
    var str1 = new String(this.user.moneda?.toString()); 
    var str2 = filtro; 
    var str3 = str1.concat(" ",str2.toString()); 

    this.user.montocreditobesco="";
    this.user.montocreditobesco= str3.replace("USD USD","USD").replace("PEN PEN","PEN"); 
  }
  changemoneda():void{ 
    
    var valor1=new String(this.user.montocreditomiranda);
    var valor2=new String(this.user.montocreditobesco); 

     
    if(this.user.moneda=="USD"){
      this.user.montocreditomiranda=valor1.replace("PEN","USD"); 
      this.user.montocreditobesco=valor2.replace("PEN","USD"); 
  
    }else{
      this.user.montocreditomiranda=valor1.replace("USD","PEN"); 
      this.user.montocreditobesco=valor2.replace("USD","PEN"); 
    }
   
  }
  creditMiranda(event: Event){ 
    const filtro= (event.target as HTMLInputElement).value;
    var str1 = new String(this.user.moneda?.toString()); 
    var str2 = filtro; 
    var str3 = str1.concat(" ",str2.toString()); 
    
    this.user.montocreditomiranda="";
    this.user.montocreditomiranda=str3.replace("USD USD","USD").replace("PEN PEN","PEN"); 
  }
  ActualizarProveedor(): void {
      
    this.user.contactosusuario=this.productForm.get("quantities")?.value; 
    
    this.user.cuentabancaria=this.cuentasForm.get("contenidocuentas")?.value;  
 
   this.user.montocreditomiranda=this.user.montocreditomiranda?.replace("USD","").trim(); 
   this.user.montocreditobesco= this.user.montocreditobesco?.replace("PEN","").trim();  

    this.userService.updateProveedor(this.user.id,this.user).subscribe((response) => {
 
      if (response.status === 200) {
        this.message = "Modificado correctamente."
    
        this.router.navigate(['/', 'Home-main']);
        //this.dialogRef.close(request);
      } else {
        this.message = "Ocurrió un error intentelo nuevamente, si el problema persiste comuniquese con su administrador."
      }
    });
  }

  
  GetProveedor(): void {
     var id_=localStorage.getItem('id_');
    if (id_ =='' || id_==null)
    {
      this.router.navigate(['/', '']);
    }
    const request: ILoginIdRequest = {
      id: id_?.toString()
      //clave: this.user.clave,
    };  
 
    this.userService.GetProveedorById(request).subscribe((response) => { 
       
      //if (response.status === 200) {
        //this.user=response.json[0];
 
        let userStr = JSON.stringify(response);   
        const objuser = JSON.parse(userStr);
        this.user=objuser[0];  
        //this.dialogRef.close(request);
     /* } else {
        this.message = "Ocurrió un error intentelo nuevamente, si el problema persiste comuniquese con su administrador."
      }*/
    });
  }


}
