import { userMeta } from './user';

export class Threadmodel {
  detail: DetailModel;
  messages: MessagesMeta;
  meta: DetailModel;
  users: Object;

  constructor() {
    this.detail = new DetailModel();
    this.messages = new MessagesMeta();
    this.meta = new DetailModel();
    this.users = new Object();
  }
}
export class MessagesMeta {
  date: number;
  from: string;
  meta: { text: string };
  read: Object;
  to: string[];
  type: number;
  user_firebase_id: string;
  constructor() {
    this.to = [];
    this.read = new Object();
  }
}
export class DetailModel {
  creation_date: string;
  creator: string;
  creator_entity_id: string;
  name: string;
  type: number;
  type_v4: number;
}
export class ThreadUser {
  status: string;
  static owner: string = 'owner';
  static member: string = 'member';
  constructor(_status: string) {
    this.status = _status;
  }
}

export class MessageReadModel {
  date: number;
  status: number;
}
