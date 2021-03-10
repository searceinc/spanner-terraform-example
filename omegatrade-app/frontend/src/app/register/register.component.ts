import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../shared/validation.service';
import { RestService } from '../auth/rest.service';
import { SocialAuthService } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { TokenStorageService } from '../auth/token-storage.service';
import { SnackBarService } from '../shared/snackbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signUpForm: any;
  loader = false;
  user: any;
  // tslint:disable-next-line: max-line-length
  constructor(private snackBarService: SnackBarService, private tokenStorage: TokenStorageService, private formBuilder: FormBuilder, private restService: RestService, private router: Router, private authService: SocialAuthService) {
    // Init sign-up form with form builder.
    this.signUpForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      businessEmail: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      provider: [''],
      photoUrl: ['']
    });
  }

  /**
   *  Function to Initiate component.
   */
  ngOnInit(): void {
    // Function to Subscribe to the authentication state.
    // Receive a SocialUser object when the user logs in and a null when the user logs out.
    this.authService.authState.subscribe((user) => {
      this.user = user;
    });
  }

  /**
   * Function to sign-up with google provider
   */
  signUpWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      this.loader = true;
      this.signUpForm.setValue({
        businessEmail: user.email,
        fullName: user.name,
        password: '',
        confirmPassword: '',
        photoUrl: user.photoUrl,
        provider: user.provider
      });
      this.loader = false;
      this.signUpForm.get('password').touched = true;
      this.signUpForm.get('confirmPassword').touched = true;
      this.snackBarService.openSnackBar('please provide password to complete your registration!', '');
    });
  }

  /**
   * Function to Register user.
   * return {null}
   */
  signUp(): void {
    if (this.signUpForm.dirty && this.signUpForm.valid) {
      if (this.signUpForm.value.password === this.signUpForm.value.confirmPassword) {
        this.loader = true;
        this.restService.postData('register-user', this.signUpForm.value)
          .subscribe(
            response => {
              if (response && response.success) {
                this.tokenSuccessHandler(response);
              }
              this.loader = false;
            },
            error => {
              this.snackBarService.openSnackBar(error.error.message, '');
              this.loader = false;
            });
      }
    }
  }

  /**
   * Function to save user information and auth token.
   * @param  response contains user profile and auth token
   */
  tokenSuccessHandler(response): void {
    this.tokenStorage.saveToken(response.authToken);
    this.tokenStorage.saveUser(response.userInfo);
    //this.router.navigateByUrl('/dashboard');
    this.snackBarService.openSnackBar(response.message, '');
  }
}
