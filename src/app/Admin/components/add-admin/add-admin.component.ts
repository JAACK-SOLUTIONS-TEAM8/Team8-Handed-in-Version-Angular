import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import { AdminService } from 'src/app/services/admin/admin.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

declare var $:any;
@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {

  constructor(
    private fromBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private adminService: AdminService,
    private router: Router) {
    this.route.params.subscribe(param => {
      this.adminId = param["id"];
    });
    
  }

  @ViewChild('cd', { static: false }) countdown: CountdownComponent;
  config:CountdownConfig={
    demand:false,
    leftTime:600,
    notify:0,
    stopTime:0
  }


  profileDetailForm: FormGroup;
  adminDetailForm: FormGroup;

  modalTitle:string="";
  modalMessage:string="";

  adminId: any;

  userTypes: any[] = [];

  adminData: any = {};



  ngOnInit(): void {
    this.initilizeForm();
    this.getUserTypes();
    if (this.adminId != 0)
      this.getAdminById();

    setTimeout(()=>{
      this.countdown.begin();
    },1000)
  }

  initilizeForm() {
    this.profileDetailForm = this.fromBuilder.group({
      userName: [null,Validators.required],
      password: [null,Validators.required],
      confirmPassword: [null,Validators.required]
    });

    this.adminDetailForm = this.fromBuilder.group({
      initials: [null,Validators.required],
      surname: [null,Validators.required],
      userTypeId: [null,Validators.required],
      idNumber: [null,Validators.required],
      email: [null,Validators.required]
    });
  }

  getUserTypes() {
    this.userService.getUserTypes().subscribe(types => {
      this.userTypes = types.userTypes;
    });
  }

  getAdminById() {
    this.adminService.getAdminById(this.adminId).subscribe(response => {
      this.adminData = response.admin;

      this.profileDetailForm.controls["userName"].patchValue(this.adminData.userName);
      this.profileDetailForm.controls["password"].patchValue(this.adminData.password);
      this.profileDetailForm.controls["confirmPassword"].patchValue(this.adminData.password);


      this.adminDetailForm.controls["userTypeId"].patchValue(this.adminData.userTypeId);
      this.adminDetailForm.controls["surname"].patchValue(this.adminData.surname);
      this.adminDetailForm.controls["initials"].patchValue(this.adminData.initials);
      this.adminDetailForm.controls["email"].patchValue(this.adminData.email);
      this.adminDetailForm.controls["idNumber"].patchValue(this.adminData.idNumber);
    });
  }



  submitAddAdminForm() {
    console.log(this.profileDetailForm.value);
    console.log(this.adminDetailForm.value);
    debugger

    if (this.profileDetailForm.controls["confirmPassword"].value != this.profileDetailForm.controls["password"].value) 
    {

      console.log("password does not matched!");

      Swal.fire({
        title: 'Warning!',
        text: 'Password did not Matched',
        icon: 'info',
        confirmButtonText: 'Ok'
      })

      return;
    }
    else if(this.profileDetailForm.invalid || this.adminDetailForm.invalid)
    {
      console.log("provide all the required fields values!");

      Swal.fire({
        title: 'Info!',
        text: 'Provide All Required Fields',
        icon: 'info',
        confirmButtonText: 'Ok'
      })

      return;
    }

    let adminDetail =
    {
      "adminUserId":  Number(0),
      "adminId": Number(this.adminId ?? 0),
      "userName": String(this.profileDetailForm.controls["userName"].value),
      "password":  String(this.profileDetailForm.controls["password"].value),
      "userTypeId": Number(this.adminDetailForm.controls["userTypeId"].value ?? 0),
      "initials":  String(this.adminDetailForm.controls["initials"].value),
      "surname":  String(this.adminDetailForm.controls["surname"].value),
      "email":  String(this.adminDetailForm.controls["email"].value),
      "idNumber":  String(this.adminDetailForm.controls["idNumber"].value),
      "cellNumber": String( "")
    };
    debugger
    console.log(adminDetail)

    this.adminService.addAdmin(adminDetail).subscribe(response => {
      if (response.statusCode == 200) {

        if(this.adminId==0)
        {
          console.log("admin added successfully!");
          this.modalTitle="Success";
          this.modalMessage="Admin Added Successfully!";
          Swal.fire({
            title: 'Success!',
            text: 'Admin Added Successfully!',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then(()=>{
            this.router.navigateByUrl("/admin/detail");
          })
        }
          else
          {
            Swal.fire({
              title: 'Success!',
              text: 'Admin Updated Successfully!',
              icon: 'success',
              confirmButtonText: 'Ok'
            }).then(()=>{
              this.router.navigateByUrl("/admin/detail");
            })
          }
      }
    });

    console.log(adminDetail);

  }
  handleEvent(event:any)
  {
    if(event.action=="done")
    {
      this.router.navigateByUrl("/admin/detail");
    }
    console.log(event);
  }
}
