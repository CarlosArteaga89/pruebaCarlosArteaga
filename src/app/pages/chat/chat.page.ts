import { Component, OnInit } from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {UsuarioInterface} from '../../interfaces/usuario';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageInterface} from '../../interfaces/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  toast: any;
  loading: any;
  msgs: MessageInterface[];

  msg: MessageInterface = {
    id: this.chatService.newId(),
    usrname: '',
    message: '',
  };

  user: UsuarioInterface = {
    id: '',
    name: '',
    email: '',
    password: '',
  };

  uid = '';

  validationsForm: FormGroup;

  validationmessages = {
    message: [
      { type: 'required', message: 'Ingrese un mensaje.' },
    ],
  };

  constructor(
    private chatService: ChatService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.chatService.stateAuth().subscribe(res => {
      if(res !== null) {
        this.uid = res.uid;
        this.getUsrInf(this.uid);
      }
    });
  }

  ngOnInit() {
    this.cargarMsgs();
    this.credencialesUsr();
    this.validationsForm = this.formBuilder.group({
      message: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }


  async createMsg() {
    this.msg.usrname = this.user.name;
    const loading = await this.loadingCtrl.create({
      message: 'Guardando...'
    });
    await loading.present();
    // Guardamos el usuario
    this.chatService.createUsr(this.msg, 'mensajes', this.msg.id).then(() => {
      loading.dismiss();
      this.presentarToast('Guardado con exito');
      this.router.navigate(['/chat']);
      location.reload();
    });
  }

  async presentarToast(msg: string) {
    this.toast = await this.toastCtrl.create({
      message: msg,
      duration: 5000,
      cssClass: 'toast'
    });
    this.toast.present();
  }

  cargarMsgs() {
    this.presentarLoading();
    this.chatService.getMsgs<MessageInterface>('mensajes').subscribe( res => {
        this.msgs = res;
        this.loading.dismiss();
        this.msg.message = '';
      }
    );
  }

  async credencialesUsr() {
    const uid = await this.chatService.getUid();
    this.user.id = uid;
    console.log(uid);
  }

  async presentarLoading() {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'normal',
      message: 'Cargando...!'
    });
    await this.loading.present();
  }

  salir() {
    this.chatService.logout().then( () => {
      this.router.navigate(['/login']);
    });
  }

  getUsrInf( uid: string){
    this.chatService.getUsr('usuarios', uid).subscribe(res => {
      this.user = res as UsuarioInterface;
    });
  }

  onSubmit(values) {
    console.log(values);
  }

}
