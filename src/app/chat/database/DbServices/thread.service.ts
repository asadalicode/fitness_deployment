import { Injectable } from '@angular/core';
import { ChatConstants } from '@app/@shared/constants/chat-constants';
import { MessagesMeta, Threadmodel } from '@app/chat/models/threadmodel';

import { Repository } from '../repository';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  private _repository = new Repository<Threadmodel>('threads');
  constructor() {}

  getThread(key: string): Promise<firebase.default.database.DataSnapshot> {
    return this._repository.getChildByKey(key).once('value');
  }

  async createnewThread(model: Threadmodel): Promise<firebase.default.database.DataSnapshot> {
    let thenableRefrence = await this._repository.Add(model);
    return thenableRefrence.once('value'); //thenable refrence is a promise of dataSnapshot returned from firebase
  }

  createMessageThread(model: MessagesMeta, ThreadKey: string): firebase.default.database.ThenableReference {
    return this._repository.getCollection.child(`${ThreadKey}/messages`).push(model);
  }

  onUpdateUsersThreads(
    threadID: string,
    callBack: (response: firebase.default.database.DataSnapshot) => any
  ): (a: firebase.default.database.DataSnapshot, b?: string) => any {
    return this._repository.getCollection
      .child(`${threadID}/messages`)
      .orderByKey()
      .limitToLast(1)
      .on('child_added', callBack);
  }

  unSubUsersThreads(threadID: string) {
    return this._repository.getCollection.child(`${threadID}/messages`).orderByKey().limitToLast(1).off('child_added');
  }

  readStatusfromMessage(threadId: string, messageId: string) {
    let userID = localStorage.getItem(ChatConstants.firebase_key);
    let threadInfo = new Object();
    threadInfo[userID] = {
      status: 2,
    };
    this._repository.getCollection
      .child(threadId)
      .child('messages')
      .child(messageId)
      .child('read')
      .update(threadInfo)
      .then((resp) => {
        console.log('Read status situation :', resp);
      });
  }
}
