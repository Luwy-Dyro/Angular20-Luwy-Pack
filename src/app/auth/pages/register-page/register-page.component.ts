import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent { 


fb = inject(FormBuilder)
hasError = signal(false)
isPosting= signal(false)
router = inject(Router)

AuthService = inject(AuthService)

registerForm = this.fb.group({

  email: ['',[ Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)] ],
  fullname:['', [Validators.required]]

})

onSubmit(){

  if(this.registerForm.invalid ){
    this.hasError.set(true)
    setTimeout(() =>{
      this.hasError.set(false);
    }, 2000 )
    return
  }
  
  const {email = '', password = '', fullname='' } = this.registerForm.value
  console.log({email , password, fullname });


  this.AuthService.register(email!, password!, fullname!).subscribe((isAuthenticated) => {
      console.log(isAuthenticated);
      if(isAuthenticated){
        // this.router.navigateByUrl('/')
        this.router.navigateByUrl('/auth/login')
        return
      }

      this.hasError.set(true)
      setTimeout( () => {
      this.hasError.set(false);
          }, 2000 )
       return
    })


}


}
