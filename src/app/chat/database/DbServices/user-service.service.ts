import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/auth';
import { user, userMeta } from '@app/chat/models/user';
import { ChatConstants } from '@app/@shared/constants/chat-constants';
import { Repository } from '../repository';
import { Permission } from '@app/auth/permission.service';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private _repository = new Repository<user>('users');
  constructor(private _authService: AuthenticationService, private permissionService: Permission) {}

  addUser(model: any, Callback: (ref: firebase.default.database.DataSnapshot) => any) {
    this._repository.getCollection
      .child('admin')
      .update(model)
      .then((ref) => {
        ref?.on('value', Callback);
      });
  }

  registerUsertoFirebase(credentials: any) {
    let new_user = new user();
    new_user.last_online = Math.round(new Date().getTime() / 1000);
    new_user.meta = {
      availability: 'available',
      name_lowercase: 'fitness admin',
      name: 'Fitness Admin',
      phone: '',
      pictureURL:
        'https://firebasestorage.googleapis.com/v0/b/fit-and-more.appspot.com/o/avatar.png?alt=media&token=fa638a23-afcc-40c6-83c4-e36f994fb237',
      userType: 'Admin',
      isChatAccess: this.permissionService.can('chat'),
    } as userMeta;
    new_user.online = true;

    this.addUser(new_user, async (snapshot) => {
      let insertedValue = snapshot.val();
      insertedValue['firebase_key'] = snapshot.key;
      console.log(snapshot.key);
      let isupdated = await this._authService.updateKey(snapshot.key);
      console.log(isupdated);
      if (!isupdated) {
        console.log('key not saved in db, Check Logs');
      }
      localStorage.setItem(ChatConstants.firebase_key, snapshot.key);
      localStorage.setItem('previous_key', snapshot.key);
    });
  }

  updateOnlineStatus() {
    this.getCurrentUser();
  }

  getAllUsers(callBack: (resp: firebase.default.database.DataSnapshot) => void) {
    this._repository.getCollection.once('value', callBack); //using call backs to perform operations on the data after it's returned
  }

  getSpecificUser(key: string): Promise<firebase.default.database.DataSnapshot> {
    return this._repository.getChildByKey(key).once('value'); //returining data as promise to retrieve data using then or await
  }

  getCurrentUser(): Promise<firebase.default.database.DataSnapshot> {
    let key = localStorage.getItem(ChatConstants.firebase_key);
    console.log(key);
    return this._repository.getCollection.child(key).once('value');
  }

  updateUserThread(userKey: string, userInvited: Object): Promise<any> {
    return this._repository.getCollection.child(`${userKey}/threads`).update(userInvited); //update the collection with the new value
  }

  updateAdminChatAccess(userKey: string, status: any): Promise<any> {
    return this._repository.getCollection.child(`${userKey}/meta`).update(status); //update the collection with the new value
  }

  updateAdminStatus(userKey: string, status: any): Promise<any> {
    return this._repository.getCollection.child(`${userKey}`).update(status); //update the collection with the new value
  }

  deleteAdmin(userKey: string): Promise<any> {
    return this._repository.getCollection.child(`${userKey}`).remove(); //delete the collection
  }

  onNewThread(userKey: string, callBack: (resp: firebase.default.database.DataSnapshot) => void) {
    this._repository.getCollection.child(`${userKey}/threads`).on('child_added', callBack);
  }

  getUserThreads(userKey: string) {
    return this._repository.getCollection.child(`${userKey}/threads`).once('value');
  }

  ChildAddedObserver(userKey: string, CallBack: (response: firebase.default.database.DataSnapshot) => void) {
    this._repository.getCollection.child(`${userKey}/threads`).on('child_added', CallBack);
  }

  onUserStatusAdded(userId: string, CallBack: (response: firebase.default.database.DataSnapshot) => void) {
    return this._repository.getCollection.child(`${userId}`).on('child_added', CallBack);
  }

  unSubUserStatusAdded(userId: string) {
    return this._repository.getCollection.child(userId).off('child_added');
  }

  onUserStatusRemoved(userId: string, CallBack: (response: firebase.default.database.DataSnapshot) => void) {
    return this._repository.getCollection.child(`${userId}`).on('child_removed', CallBack);
  }

  unSubUserStatusRemoved(userId: string) {
    return this._repository.getCollection.child(`${userId}`).off('child_removed');
  }
}
