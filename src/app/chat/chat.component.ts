import { Component, ElementRef, ViewChild, OnInit } from "@angular/core";

import {STATUSES, User} from './models'
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public statuses = STATUSES;
  public activeUser: User;
  public selfUser: User;
  public users: User[] = [];
  public expandStatuses: boolean = false;
  public expanded: boolean = false;
  messageReceivedFrom = {
    img: 'https://cdn.livechat-files.com/api/file/lc/img/12385611/371bd45053f1a25d780d4908bde6b6ef',
    name: 'Media bot'
  }

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(
    private service: AuthService, 
    private router: Router, 
    // private chatService: ChatService
  ) { }

  ngOnInit() {
    this.setSelfUser();
    // this.chatService.onConnect();
    this.fetchData();
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  }

  setSelfUser = (): void => {
   this.selfUser = new User(JSON.parse(localStorage.getItem('user')));
  }

  fetchData = (): void => {
    this.service.list().subscribe((res: any) => {
      if(res.status) {
        res.data.sort((a, b) => {
          const timestampA = new Date(a.messages[0]?.timestamp || '1970-01-01').getTime();
          const timestampB = new Date(b.messages[0]?.timestamp || '1970-01-01').getTime();
          return timestampB - timestampA;
        });
        for(let user of res.data) {
          this.users.push(new User(user));
        }
        this.setUserActive(this.users[0]);
        this.scrollToBottom();
      }
    });
  }

  addNewMessage(inputField) {
    const val = inputField.value?.trim()
    if (val.length) {
      this.activeUser.messages.push({
        sender_id: this.selfUser.id,
        receiver_id: this.activeUser.id,
        message: val
      });
      this.selfUser.ws.send(
        JSON.stringify({sender_id: this.selfUser.id, receiver_id: this.activeUser.id, message: val})
      );
    }
    inputField.value = '';
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  setUserActive(user) {
    this.activeUser = user;
    this.connectToWS();
  }

  connectToWS() {
    if (this.selfUser.ws && this.selfUser.ws.readyState !== 1) {
      this.selfUser.ws = null;
      alert('eski wajah se hua');
      this.selfUser.status = STATUSES.OFFLINE;
    }
    if (this.selfUser.ws) {
      return;
    }
    const ws = new WebSocket('ws://localhost:8000');
    this.selfUser.ws = ws;
    ws.onopen = (event) => {
      this.selfUser.status = STATUSES.ONLINE;
      this.selfUser.ws.send(JSON.stringify({_id: this.selfUser.id}));
    };
    ws.onclose = (event) => this.selfUser.status = STATUSES.OFFLINE;
    ws.onerror = (event) => this.selfUser.status = STATUSES.OFFLINE;
    this.selfUser.ws.onmessage = (result: any) => {
      const data = JSON.parse(result?.data || {});
      const index = this.users.findIndex(u => u.id == data.sender_id);
      this.users[index].messages.push(data);
    };
  }

  onWSEvent(event, status: STATUSES) {
    this.users.forEach(u => u.ws === event.target ? u.status = status : null)
  }

  logout = () => {
    this.service.logout().subscribe((res: any) => {
      if(res.status) {
        localStorage.removeItem('token');
        alert(res.message);
        this.router.navigate(['/auth/login']);
      }
    })
  }
}
