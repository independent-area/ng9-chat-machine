import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(public fb: FormBuilder, private service: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit = (): void => {
    if(this.loginForm.valid) {
      this.service.login(this.loginForm.value).subscribe((res: any) => {
        if(res.status) {
          alert(res.message);
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/']);
        }
      });
    }
  }

}
