export class user {
  last_online: number;
  meta: userMeta;
  online: boolean;
}

export class userMeta {
  availability: string;
  name: string;
  name_lowercase: string;
  phone: string;
  pictureURL: string;
  userType: string;
  isChatAccess: boolean;
}
