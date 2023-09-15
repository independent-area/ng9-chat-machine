export enum STATUSES {
    AWAY = "away",
    BUSY = "busy",
    ONLINE = "online",
    OFFLINE = "offline"
  }
  
  export class SocialMedia {
    facebook: string = "";
    twitter: string = "";
    instagram: string = "";
  }
  
  export interface Message {
    id?: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    timestamp?: string;
  }
  
  export class User {    
    public name: string = "";
    public id: any = null;
    public status: STATUSES = STATUSES.OFFLINE;
    public img: string = "";
    public messages: Message[] = [];
    ws: any;
    social: SocialMedia = new SocialMedia();
    
    constructor(public data: any) {
      this.id = data.id;
      this.name = data.name;
      this.status = data.status || STATUSES.OFFLINE;
      this.img = data.img || "";
      this.messages = data.messages || [];
    }
  }
  