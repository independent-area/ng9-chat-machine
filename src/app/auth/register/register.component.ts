import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(public fb: FormBuilder, private service: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit = (): void => {
    if(this.registerForm.valid) {
      this.service.register(this.registerForm.value).subscribe((res: any) => {
        if(res.status) {
          alert(res.message);
          this.router.navigate(['/auth/login']);
        }
      });
    }
  }

}
