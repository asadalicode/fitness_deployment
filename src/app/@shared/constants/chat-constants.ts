import * as _ from 'lodash';
import { debounce } from 'lodash';

export class ChatConstants {
  static get firebaseConnectionCreds() {
    return {
      apiKey: 'AIzaSyDYMeS_Nsvmb5_ctrsziWQGCXHqK8Sjx5g', // fitandmore firebase
      databaseURL: 'https://fit-and-more-default-rtdb.firebaseio.com/',
    };
  }

  /**
   *
   */
  private constructor() {}

  private debounceMethod: any;
  static get Instance() {
    return new ChatConstants();
  }

  static get AdminModel() {
    return 'AdminModel';
  }
  static get firebase_key() {
    return 'firebase_key';
  }
  private isCalled = false;

  async readUrlAsFile(fileURL: string): Promise<any> {
    return new Promise((resolve) => {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', fileURL);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        let blob: any = xhr.response;
        blob.lastModifiedDate = new Date();
        blob.name = fileURL.split('/').pop();
        resolve(blob);
      };
      xhr.send();
    });
  }

  executeDebounce(method: () => void, timeInterval?: number) {
    if (this.debounceMethod) {
      this.debounceMethod.cancel();
    }

    let localTime = timeInterval ? timeInterval : 1000;

    this.debounceMethod = debounce(() => {
      method();
    }, localTime);
    this.debounceMethod();
  }
}
