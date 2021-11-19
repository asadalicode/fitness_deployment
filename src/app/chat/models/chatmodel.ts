export class Chatmodel {
  id: string;
  src: string;
  message: string;
  type: number;
  time: Date;
  to: string;
  from: string;
  image: string;
  isVideo: boolean;
  videoLink: string;
  constructor() {
    this.id = '';
    this.src = '';
    this.message = '';
    this.type = 0;
    this.time = new Date();
    this.to = '';
    this.from = '';
    this.image = '';
    this.isVideo = false;
    this.videoLink = '';
  }
}
