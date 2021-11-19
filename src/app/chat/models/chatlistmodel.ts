export class Chatlistmodel {
  thumbnail: string;
  id: string;
  senderUserName: string;
  name: string;
  message: string;
  time: Date;
  userID: string;
  isBold: boolean;
  isOnline: boolean;
  isInit: boolean;
  messageCounter: number;
  constructor(val: any);
  constructor(_thumbnail: string, _id: number, _name: string, _message: string, _time: string);
  constructor();
  constructor(val?: any, _thumbnail?: any, _id?: any, _name?: any, _message?: any, _time?: any) {
    if (val) {
      this.thumbnail = val.thumbnail;
      this.id = val.id;
      this.name = val.name;
      this.message = val.message;
      this.time = val.time;
    } else {
      this.thumbnail = _thumbnail;
      this.id = _id;
      this.name = _name;
      this.message = _message;
      this.time = _time;
    }
    this.isBold = false;
    this.isInit = false;
    this.messageCounter = 0;
    this.senderUserName = '';
  }
}
