import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatService} from '../../services/chat.service';
import {Router} from '@angular/router';
import {UsuarioInterface} from '../../interfaces/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validationsForm: FormGroup;
  errorMessage = '';

  user: UsuarioInterface = {
    id: '',
    name: '',
    email: '',
    password: '',
  };

  validationmessages = {
    email: [
      { type: 'required', message: 'Ingrese su correo.' },
    ],
    password: [
      { type: 'required', message: 'Ingrese su contraseña.' },
    ]
  };

  constructor(
    private chatService: ChatService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  async loginUser() {
    try {
      this.chatService.login(this.user.email, this.user.password);
      this.router.navigate(['/chat']);
    } catch (error){
      console.log('Error', error);
    }
  }

  irRegistro() {
    this.router.navigate(['/register']);
  }

  onSubmit(values) {
    console.log(values);
  }

}
