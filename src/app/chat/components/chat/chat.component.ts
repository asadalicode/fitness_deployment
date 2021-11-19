import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { ChatConstants } from '@app/@shared/constants/chat-constants';
import { ChatHelperService } from '@app/@shared/services/chat-helper-service.service';
import { DataService } from '@app/@shared/services/data.service';
import { ThreadService } from '@app/chat/database/DbServices/thread.service';
import { UserServiceService } from '@app/chat/database/DbServices/user-service.service';
import { Chatlistmodel } from '@app/chat/models/chatlistmodel';
import { Chatmodel } from '@app/chat/models/chatmodel';
import { ChatService } from '@app/chat/services/chat.service';
import { Observable } from 'rxjs';
import {
  DetailModel,
  MessageReadModel,
  MessagesMeta,
  Threadmodel,
  ThreadUser,
} from '../../models/threadmodel';
import { Users } from '@app/@shared/Models/users';
import { environment } from '@env/environment';
import { observableModel } from '@app/chat/models/observableModel';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  textMessage: string = '';
  searchEnabled = false;
  form: FormGroup;

  counterSnapDB: boolean = false;
  userChatThread: any;
  currentUserID = localStorage.getItem(ChatConstants.firebase_key);
  @ViewChild('searchInput', { static: false })
  searchInput: ElementRef;
  userType: string = 'User';
  selectedChatData: any = {};
  AllUsers: any[] = [];
  recentMessagesList: Chatlistmodel[] = [new Chatlistmodel()];
  userThreads: string[] = [];
  categories: Observable<any[]>;
  currentUser: any;
  messagesHistory: Chatmodel[] = [new Chatmodel()];

  isLoading: boolean = false;
  isMessagesLoading: boolean = false;
  selectedCategory: string = 'All';
  tempRecentMessage: Chatlistmodel[];
  isDisabled = true;
  debounce = ChatConstants.Instance;
  isRunningFirstTime = true;
  usersList: any = [];
  observableThreads = new Array<observableModel>(); // this array will populate from initList function only to further use into applying receiver observers
  currentlyObservingThreads = new Array<observableModel>(); // this array will be populated after the observables are applied
  monitorChatsEnabled: boolean = false;
  credentials = new Object();
  selectedChatTitle = ''; // only used for monitor chats
  constructor(
    private formBuilder: FormBuilder,
    private _userServiceDb: UserServiceService,
    private _threadServiceDb: ThreadService,
    private _chatService: ChatService,
    private _chatHelper: ChatHelperService,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this.credentials = JSON.parse(
      sessionStorage.getItem('fitness_credentials')
    );
    console.log(this.credentials);
    this.InitList();
  }

  getCategories(level: number, parentID: number, flag: number) {
    //getting initial categories
    this.categories = this._chatService.getCategories(level, parentID, flag);
  }

  trackByMessage(index: number, item: Chatlistmodel) {
    return item['message'];
  }

  observerReceiver = (forSub = true) => {
    let methodsArray: any[] = [];
    let statusMethodArray: any[] = [];
    if (this.observableThreads.length > 0) {
      this.observableThreads.forEach((observalbeThread) => {
        if (forSub) {
          if (
            !this.currentlyObservingThreads.some(
              (x) =>
                x.threadId === observalbeThread.threadId &&
                x.userId === observalbeThread.userId
            )
          ) {
            statusMethodArray.push(() => {
              this.updateStatus(observalbeThread.userId);
            });
            methodsArray.push(() => {
              this.receiveMessage(observalbeThread.threadId);
            });
            this.currentlyObservingThreads.push(observalbeThread);
          }
        } else {
          this._threadServiceDb.unSubUsersThreads(observalbeThread.threadId);
          this._userServiceDb.unSubUserStatusAdded(observalbeThread.userId);
        }
      });
      methodsArray.forEach((method) => {
        this.executeArrayMethod(method);
      });
      statusMethodArray.forEach((method) => {
        this.executeArrayMethod(method);
      });
    }
  };

  updateStatus(userId: string) {
    this._userServiceDb.onUserStatusAdded(userId, (updatedUser) => {
      if (updatedUser.exists()) {
        let currentThread = this.currentlyObservingThreads.find(
          (x) => x.userId === userId
        );
        let index = this.recentMessagesList.findIndex(
          (x) => x.id === currentThread?.threadId
        );
        if (updatedUser.key === 'online')
          this.recentMessagesList[index].isOnline = updatedUser.val();
      }
    });

    this._userServiceDb.onUserStatusRemoved(userId, (updatedUser) => {
      if (updatedUser.exists()) {
        let currentThread = this.currentlyObservingThreads.find(
          (x) => x.userId === userId
        );
        let index = this.recentMessagesList.findIndex(
          (x) => x.id === currentThread?.threadId
        );
        if (updatedUser.key === 'online')
          this.recentMessagesList[index].isOnline = false;
      }
    });
  }

  executeArrayMethod(method: any) {
    method();
  }

  receiveMessage = (threadID: string) => {
    this._threadServiceDb.onUpdateUsersThreads(threadID, (resp) => {
      let isValid = resp && resp.exists() ? true : false;
      let messageThread = resp.ref.parent.parent.key;
      let rMessage = resp.val();
      let validThread = this.recentMessagesList.find(
        (x) => x.id === messageThread
      );
      if (rMessage.type === 2) {
        rMessage['meta'].text = `video: ${rMessage?.meta?.extraMap?.reason}`;
      }
      isValid = rMessage.from !== this.currentUserID && rMessage['meta'].text;
      if (isValid) {
        console.log(this.selectedChatData);
        if (this.selectedChatData.id === messageThread && validThread.isInit) {
          this.recentMessagesList[
            this.recentMessagesList.indexOf(validThread)
          ].time = new Date(rMessage.date);
          this.updateUIwithMessage(
            rMessage.meta.text,
            new Date(rMessage.date),
            resp.key,
            2,
            messageThread,
            rMessage.type === 2
          );
        } else {
          this.recentMessagesList[
            this.recentMessagesList.indexOf(validThread)
          ].messageCounter =
            rMessage.read[this.currentUserID].status !== 2 && validThread.isInit
              ? validThread.messageCounter + 1
              : validThread.messageCounter;
          this.recentMessagesList[
            this.recentMessagesList.indexOf(validThread)
          ].isInit = true;
          this.recentMessagesList[
            this.recentMessagesList.indexOf(validThread)
          ].time = new Date(rMessage.date);
        }
      } else {
        this.recentMessagesList[
          this.recentMessagesList.indexOf(validThread)
        ].time = new Date(rMessage.date);
        this.recentMessagesList[
          this.recentMessagesList.indexOf(validThread)
        ].isInit = true;
        this.recentMessagesList[
          this.recentMessagesList.indexOf(validThread)
        ].message = rMessage['meta'].text;
      }
      this.ShowOnTop(messageThread, rMessage);
    });
  };

  private InitList() {
    let counter = 0;
    this.isLoading = true;
    this.observableThreads = [];
    this.currentlyObservingThreads = [];
    this._userServiceDb.getCurrentUser().then((snap) => {
      let messagesArr: Chatlistmodel[] = [];
      if (snap.exists()) {
        this.currentUser = snap.val();
        if (this.currentUser.hasOwnProperty('threads')) {
          let threads = this.currentUser['threads'];
          this.userThreads = Object.keys(this.currentUser['threads']); //getting thread ids which are attached with this user
          this.userThreads.forEach(async (val, index) => {
            let currentThread = threads[val];
            let threadMember = currentThread.invitedBy;
            let threadResp = await await this._threadServiceDb.getThread(val);
            if (threadMember === this.currentUserID) {
              // if invited by is our own user then we have to get other members id from thread/users -
              let thread = threadResp.val();
              let threadMembers = thread['users'];
              let memberKeys = Object.keys(threadMembers).filter((val) => {
                return val != this.currentUserID;
              });
              threadMember = memberKeys[0];
            }

            let resp = await this._userServiceDb.getSpecificUser(threadMember);
            if (resp.exists()) {
              let user_data = resp.val();
              let userKeys = Object.keys(user_data);
              let lastOnlineKey = userKeys.filter((val) => {
                return val === 'last-online' || val === 'last_online'; //There was a diffrence in our keys because typescript didn't allowed properties with hyphen
              });
              let isCorrectType: boolean = user_data.meta.hasOwnProperty(
                'userType'
              )
                ? this.userType.toLowerCase() ===
                  user_data.meta.userType.toLowerCase()
                : false;
              if (isCorrectType) {
                let tempObservableModel = new observableModel();

                counter = 0; //  re-initialize on every iteration
                let tMessage = threadResp.child('messages').toJSON();
                let messages = Object.keys(tMessage);
                let latestMessageTime = 0;
                for (let i = messages.length - 1; i > 0; i = i - 1) {
                  if (i === 0) latestMessageTime = tMessage[messages[i]]?.date;
                  // count unread messages for every thread
                  if (
                    tMessage[messages[i]]?.read[this.currentUserID]?.status ===
                    0
                  )
                    counter = counter + 1;
                  else {
                    break; // used to halt the loop when any read message arrive so we dont have to traverse the whole array.
                  }
                }
                tempObservableModel.threadId = val;
                tempObservableModel.userId = resp.key;
                this.observableThreads.push(tempObservableModel);
                let model = {
                  name: this.getvaluebyKey(2, user_data.meta),
                  thumbnail:
                    environment.image_url + '/' + user_data.meta.pictureURL,
                  id: val,
                  time:
                    this._chatHelper.tryParseDate(latestMessageTime) ||
                    this._chatHelper.tryParseDate(user_data[lastOnlineKey[0]]),
                  userID: resp.key,
                  isBold: false,
                  isOnline: user_data.online,
                  isInit: false,
                  messageCounter: counter,
                } as Chatlistmodel;
                messagesArr.push(model);
              }
            }
            let containsThreads = messagesArr.length > 0;
            if (containsThreads && index === this.userThreads.length - 1) {
              this.isDisabled = true;

              this.recentMessagesList = messagesArr; //adding existing threads to the list,
              this.recentMessagesList = this._chatHelper.ArraySortByKey(
                this.recentMessagesList,
                'time'
              ) as Chatlistmodel[]; // sorting threads
              this.tempRecentMessage = this.recentMessagesList;
              this.selectedChat(this.recentMessagesList[1]); // selecting the first thread to be shown in the messages pane
              this.debounce.executeDebounce(() => {
                this.observerReceiver(); //Observer for any new Message
                this.onNewThread(); //Obsrerver for any new Threads
              });
            }
          });
        }
      }
      this.isLoading = false;
    });
    this.createGroupForm();
  }

  monitorUsersChat() {
    this.recentMessagesList = [new Chatlistmodel()];
    let addedThreads = new Array();
    this.monitorChatsEnabled = true;
    this._userServiceDb.getAllUsers((response) => {
      let jsonResp = response.toJSON();
      delete jsonResp[this.currentUserID];
      let userValues = Object.values(jsonResp);
      let userKeys = Object.keys(jsonResp);
      this.selectedChatData = null;
      userValues.forEach((item, index) => {
        if (item.hasOwnProperty('meta') && item.hasOwnProperty('threads')) {
          let threadIds = Object.keys(item.threads);
          threadIds.forEach((thread: any, i) => {
            this._threadServiceDb.getThread(thread).then((resp) => {
              let threadValue = resp.val();
              if (threadValue.users.hasOwnProperty('admin')) return;
              if (threadValue.hasOwnProperty('messages')) {
                let tempChatListModel = new Chatlistmodel();
                tempChatListModel.id = thread;
                tempChatListModel.senderUserName = userKeys[index];
                tempChatListModel.name = item.meta.name;
                tempChatListModel.thumbnail = item.meta.pictureURL;
                tempChatListModel.isBold = false;
                tempChatListModel.isOnline = false;
                let recieverUserName = Object.keys(threadValue.users).find(
                  (x) => x !== userKeys[index]
                );
                tempChatListModel.name = `<span>${item.meta.name} <img class='pl-2 pr-2' src='assets/arrow-icon.svg' alt='->'> ${threadValue.users[recieverUserName].name}</span>`;
                if (!addedThreads.includes(thread)) {
                  addedThreads.push(thread);
                  this.recentMessagesList.push(tempChatListModel);
                }
              }
              if (i === threadIds.length - 1) {
                this.tempRecentMessage = this.recentMessagesList;
                this.selectedChat(this.recentMessagesList[1]);
              }
            });
          });
        }
      });
    });
  }

  onTypeClicked(userType: string) {
    this.searchEnabled = false;
    this.searchInput.nativeElement.value = '';
    this.userType = userType;
    this.monitorChatsEnabled = false;
    this.messagesHistory = [new Chatmodel()];
    this.selectedChatData = new Object();
    this.recentMessagesList = [new Chatlistmodel()];
    this.observerReceiver(false);
    this.InitList();
  }

  onNewThread() {
    this._userServiceDb.onNewThread(this.currentUserID, (snap) => {
      if (snap.exists()) {
        let newThread = snap.val();
        let isExisiting = this.recentMessagesList.filter((val) => {
          //checking if this chat is new or an existing one.
          return val.id === snap.key;
        });

        if (isExisiting.length === 0 && newThread.hasOwnProperty('invitedBy')) {
          if (newThread.invitedBy !== this.currentUserID) {
            // checking if the chat is initiated by other user then proceed
            this._userServiceDb
              .getSpecificUser(newThread.invitedBy)
              .then((resp) => {
                if (resp.exists()) {
                  let user_data = resp.val();
                  let userKeys = Object.keys(user_data);
                  let lastOnlineKey = userKeys.filter((val) => {
                    return val === 'last-online' || val === 'last_online'; //There was a diffrence in our keys because typescript didn't allowed properties with hyphen
                  });
                  let keys = Object.keys(user_data.meta);
                  let model = {
                    name: user_data.meta[keys[1]],
                    thumbnail:
                      environment.image_url + '/' + user_data.meta.pictureURL,
                    id: snap.key,
                    time: this._chatHelper.tryParseDate(
                      user_data[lastOnlineKey[0]]
                    ),
                    isBold: false,
                    isInit: false,
                    messageCounter: 0,
                  } as Chatlistmodel;
                  let isCorrectType = user_data.meta.hasOwnProperty('userType')
                    ? this.userType.toLowerCase() ===
                      user_data.meta.userType.toLowerCase()
                    : false;
                  if (isCorrectType) {
                    let tempObservableModel = new observableModel();
                    tempObservableModel.threadId = snap.key;
                    tempObservableModel.userId = resp.key;
                    this.recentMessagesList.unshift(model);
                    this.tempRecentMessage = this.recentMessagesList; // update temp list as well as the main list for search feature
                    this.selectedChat(this.recentMessagesList[0]);
                    this.observableThreads.push(tempObservableModel); // adding new thread to the list to attach an observer to it aswell
                    this.observerReceiver();
                  }
                }
              });
          }
        }
      }
    });
  }

  closeSearch() {
    this.searchEnabled = false;
    this.searchInput.nativeElement.value = '';
    this.recentMessagesList = this.tempRecentMessage;
    // this.debounce.executeDebounce(() => {
    //   this.InitList();
    // }, 250);
  }

  SearchAllUsers(searchQuery: string) {
    this.isDisabled = true;
    this.selectedCategory = 'All';
    this.recentMessagesList = [new Chatlistmodel()];
    this.messagesHistory = [new Chatmodel()];
    this.debounce.executeDebounce(() => {
      this.isLoading = true;
      if (!this.monitorChatsEnabled) {
        let messagesArr: Chatlistmodel[] = [];
        this._userServiceDb.getAllUsers((response) => {
          let userValues = response.val();
          let valKeys = Object.keys(userValues);
          let otherUsers = valKeys.filter((val: any) => {
            return val != localStorage.getItem(ChatConstants.firebase_key);
          });
          otherUsers.forEach((val) => {
            let singleUser = userValues[val];

            let singleUserKeys = Object.keys(singleUser);
            let haveMeta = singleUser.hasOwnProperty('meta');
            if (!haveMeta) {
              return;
            }
            let userData = singleUser.meta;
            let lastOnlineKey = singleUserKeys.filter((val: any) => {
              return val === 'last-online' || val === 'last_online'; //There was a diffrence in our keys because typescript didn't allowed properties with hyphen
            });

            if (!userData.hasOwnProperty('userType')) {
              userData['userType'] = 'User';
            }
            let isUserChatExist = this.tempRecentMessage.find(
              (x) => x.name === this.getvaluebyKey(2, userData)
            ); // check if user chat is already existed
            const isUser =
              (searchQuery === '' ||
                this.getvaluebyKey(2, userData)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())) &&
              this.userType.toLowerCase() === userData.userType.toLowerCase();
            // console.log(singleUser);
            if (isUser) {
              let model = {
                name: this.getvaluebyKey(2, userData),
                thumbnail: environment.image_url + '/' + userData.pictureURL,
                id: isUserChatExist ? isUserChatExist.id : val, // place it's thread id otherwise use firebase id
                time: this._chatHelper.tryParseDate(
                  singleUser[lastOnlineKey[0]]
                ),
                isOnline: singleUser.online,
              } as Chatlistmodel;
              messagesArr.push(model);
            }
          });
          this.recentMessagesList = messagesArr;
          // console.log(this.recentMessagesList);
          // if (!isEmpty(searchQuery)) {
          //   this.tempRecentMessage = this.recentMessagesList;
          // }
        });
      } else {
        let searchArr = this.tempRecentMessage.slice(1);

        this.recentMessagesList = searchArr.filter((x) => {
          console.log(x);
          return x?.name?.toLowerCase()?.includes(searchQuery);
        });
      }
      this.isLoading = false;
    }, 1000);
  }

  loadLatestChatValues() {
    this.InitList();
    this.counterSnapDB = false;
  }

  async isnewChat(selectedUser: any): Promise<boolean> {
    let anycommonThreads: boolean = false;
    if (this.counterSnapDB) this.loadLatestChatValues();
    if (selectedUser) {
      let receiptent = await await this._userServiceDb.getSpecificUser(
        selectedUser.id
      );
      if (receiptent.exists() && this.currentUser) {
        let senderObj: any[] = this.currentUser;
        let receiptentObj = receiptent.val();
        let senderObjKeys = Object.keys(senderObj);
        const neededKeys = ['last_online', 'meta', 'online', 'threads'];
        neededKeys.map((key) => {
          if (!Object.keys(senderObj).includes(key)) {
            senderObjKeys.push(key);
            senderObj = { ...senderObjKeys };
            this.counterSnapDB = true;
          }
        });

        let receiptentObjKeys = Object.keys(receiptentObj);
        let senderThreads =
          senderObj[senderObjKeys[senderObjKeys.length - 1]] || [];
        let receiverThreads =
          receiptentObj[receiptentObjKeys[receiptentObjKeys.length - 1]];
        let commonEle = Object.keys(senderThreads).filter((val) => {
          return Object.keys(receiverThreads).indexOf(val) !== -1;
        });

        this.userChatThread = commonEle;
        anycommonThreads = !(commonEle.length > 0);
      }
    }
    return anycommonThreads;
  }

  async sendMessage(message: string) {
    message = message.trim(); // removing any trailing spaces from start/end
    if (this.monitorChatsEnabled)
      // refrain user to send message incase of monitor chats.
      return;
    let noOfMessages: number =
      this.getSelectedGroup.length > 0 ? this.getSelectedGroup.length : 1; //Determining if this is a single message or a group
    if (message == null || message === '') return;
    for (let i = 0; i < noOfMessages; i++) {
      if (await await this.isnewChat(this.getSelectedGroup[i])) {
        let new_Thread = new Threadmodel();
        let thread_detail = {
          creation_date: new Date().getTime().toString(),
          creator: this.currentUserID,
          creator_entity_id: this.currentUserID,
          type: 2,
          type_v4: 2,
          name: this.getvaluebyKey(2, this.currentUser.meta),
        } as DetailModel;
        let to_list: string[] = new Array(this.getSelectedGroup[i].id);
        let _message_model = new MessagesMeta();
        _message_model.date = new Date().getTime(); //converting date to milliseconds timestamp
        _message_model.from = this.currentUserID;
        _message_model.meta = { text: message };
        _message_model.to = to_list;
        _message_model.type = 0;

        _message_model.read[to_list[0]] = new MessageReadModel();
        _message_model.read[this.currentUserID] = new MessageReadModel();
        _message_model.read[this.currentUserID].status = 2;
        _message_model.user_firebase_id = this.currentUserID;
        new_Thread.detail = thread_detail;
        new_Thread.meta = thread_detail;
        new_Thread.users[this.currentUserID] = new ThreadUser(ThreadUser.owner);
        new_Thread.users[this.getSelectedGroup[i].id] = new ThreadUser(
          ThreadUser.member
        );

        let inserted_thread = await this._threadServiceDb.createnewThread(
          new_Thread
        );

        let inserted_message = await this._threadServiceDb.createMessageThread(
          _message_model,
          inserted_thread.key
        );
        to_list.push(this.currentUserID);
        this.updateUsersThreads(to_list, inserted_thread.key);

        if (i === noOfMessages - 1) {
          this.updateUIwithMessage(
            message,
            new Date(_message_model.date),
            inserted_message.key,
            1
          );
        }
      } else {
        if (
          !this.searchEnabled &&
          !this.selectedChatData.hasOwnProperty('id')
        ) {
          return;
        }

        let thread = this.selectedChatData
          ? this.selectedChatData
          : this.tempRecentMessage.find(
              (x) => x.userID === this.getSelectedGroup[i].id
            );
        let thread_Id: string = thread ? thread.id : this.userChatThread[0];

        let _message_model = new MessagesMeta();
        _message_model.date = new Date().getTime();
        _message_model.from = this.currentUserID;
        _message_model.meta = { text: message };

        _message_model.read[this.currentUserID] = new MessageReadModel();
        _message_model.read[this.currentUserID].status = 2;

        if (thread && this.recepitentUserIDb) {
          _message_model.to.push(this.recepitentUserIDb);
        } else {
          _message_model.to = this.getSelectedGroup.map((element: any) => {
            return element.id;
          });
        }
        _message_model.read[this.recepitentUserIDb] = new MessageReadModel();
        _message_model.read[this.recepitentUserIDb].status = 1;
        _message_model.type = 0;
        _message_model.user_firebase_id = this.currentUserID;
        let inserted_message = await this._threadServiceDb.createMessageThread(
          _message_model,
          thread_Id
        );
        thread_Id = '';
        if (i === noOfMessages - 1) {
          this.updateUIwithMessage(
            message,
            new Date(_message_model.date),
            inserted_message.key,
            1
          );
        }
      }
    }

    this.isDisabled = true;
  }

  updateUIwithMessage(
    message: string,
    date: Date,
    messageID: string,
    type: number,
    threadID?: string,
    isVideo: boolean = false,
    videoLink: string = ''
  ) {
    let new_Chat = new Chatmodel();
    console.log(videoLink);
    new_Chat.id = messageID;
    new_Chat.message = message;
    new_Chat.time = date;
    new_Chat.type = type;
    new_Chat.isVideo = isVideo;
    new_Chat.videoLink = videoLink;
    this.messagesHistory.push(new_Chat);
    this.textMessage = '';
    if (threadID) {
      this.recentMessagesList.map((val) => {
        if (val.id === threadID) {
          val.isBold = type === 2 ? true : false;
          val.message = message;
        }
        return val;
      });
      this.ShowOnTop(threadID, message);
    }
  }

  private ShowOnTop(threadID: string, message?: string) {
    // console.log('Message on line 410');
    let _currentThread = this.recentMessagesList.find((x) => x.id === threadID);
    _currentThread.isBold ? (_currentThread.isBold = true) : false;
    _currentThread.message = message['meta'].text;
    this.recentMessagesList = this._chatHelper.ArraySortByKey(
      this.recentMessagesList,
      'time',
      2
    ) as Chatlistmodel[]; // sorting threads
  }

  updateUsersThreads(toList: string[], threadID: string) {
    toList.forEach(async (val) => {
      let threadInfo: Object = new Object();
      threadInfo[threadID] = {
        invitedBy: localStorage.getItem(ChatConstants.firebase_key),
      };
      let value = await this._userServiceDb.updateUserThread(val, threadInfo);
      this.currentUser.threads[Object.keys(threadInfo)[0]] =
        threadInfo[Object.keys(threadInfo)[0]];
    });
  }

  createGroupForm() {
    this.form = this.formBuilder.group({
      group: new FormArray([]),
    });
  }

  getvaluebyKey(key: number, model: any) {
    let model_keys = Object.keys(model);
    return model[model_keys[key]];
  }

  get groupFormArray() {
    return this.form.controls.group as FormArray;
  }

  onCheckBoxClicked(index: number) {
    let control = this.groupFormArray.controls[index];
    if (control.value) control.setValue(false);
    else control.setValue(true);

    this.isDisabled = false;
  }

  handleShiftEnter(event: KeyboardEvent) {
    if (event.shiftKey && event.key === 'Enter') {
      // console.log('combination caputured');
    }
  }

  onInput(args: string) {
    let checkUser =
      !(this.selectedChatData instanceof Chatlistmodel) ||
      (this.searchEnabled && this.getSelectedGroup.length === 0);
    if (args && args !== '' && checkUser) this.isDisabled = false;
    else this.isDisabled = true;
  }

  get getSelectedGroup() {
    const selected = this.form.value.group
      .map((checked: any, i: any) =>
        checked ? this.recentMessagesList[i] : null
      )
      .filter((v: any) => v !== null);
    return selected;
  }

  changeReadStatus(messagesKey: string, threadId: string) {
    this._threadServiceDb.readStatusfromMessage(threadId, messagesKey);
  }
  // selected chat from the recent messages
  recepitentUserIDb: string;

  selectedChat(item: Chatlistmodel) {
    let firstUserKey: string = item.name.includes('->')
      ? item.senderUserName
      : this.currentUserID;

    this.messagesHistory = [new Chatmodel()];
    this.isMessagesLoading = true;
    if (item == null) {
      this.isMessagesLoading = false;
      return;
    }

    this.recentMessagesList[
      this.recentMessagesList.indexOf(item)
    ].isBold = false;
    this.recentMessagesList[
      this.recentMessagesList.indexOf(item)
    ].messageCounter = 0;

    this.selectedChatData = item;
    this.selectedChatData.isBold = false;
    this._threadServiceDb.getThread(item.id).then((response) => {
      try {
        if (response.exists()) {
          let threadModel = response.val();
          let userKeys = Object.keys(threadModel.users);
          this.recepitentUserIDb = userKeys.filter((val) => {
            return val != firstUserKey;
          })[0];
          let localMessageList: Chatmodel[] = [];

          let messages = threadModel.messages;
          let messagesObjKeys = Object.keys(threadModel.messages);
          messagesObjKeys.forEach((key, index) => {
            let internalChat = messages[key];
            if (internalChat.meta.text !== '') {
              if (
                internalChat.hasOwnProperty('read') &&
                !this.monitorChatsEnabled
              ) {
                let readStatus = internalChat.read[firstUserKey];
                if (readStatus && readStatus.status === 0) {
                  this.changeReadStatus(key, item.id);
                }
              }
              let model = new Chatmodel();
              model.id = key;
              model.message =
                internalChat.type === 2
                  ? internalChat.meta?.extraMap?.reason
                  : internalChat.meta.text;
              model.type = internalChat.from === firstUserKey ? 1 : 2;
              model.src = environment.image_url + '/' + item.thumbnail;
              model.time = this._chatHelper.tryParseDate(internalChat.date);
              model.from = internalChat.from;
              model.to = internalChat.to[0];
              model.isVideo = internalChat.type === 2 ? true : false;
              if (internalChat.type === 2) {
                model.videoLink = `${environment.sasContainerUrl}/${internalChat.meta['video-url']}${environment.sasTokenUrl}`;

                // `${environment.image_url}/${internalChat.meta['video-url']}`;
              }
              localMessageList.push(model);
              if (index === messagesObjKeys.length - 1) {
                this._userServiceDb
                  .getSpecificUser(this.recepitentUserIDb)
                  .then((resp) => {
                    if (resp.exists()) {
                      let _recep_user_val = resp.val();
                      localMessageList = localMessageList.map((x) => {
                        // rendering images after the list is populated because of monitor chats where we need to fetch the image of the other person aswell
                        if (!this.monitorChatsEnabled) {
                          x.image =
                            x.type === 1
                              ? this.currentUser['meta']['pictureURL']
                              : this.recentMessagesList[
                                  this.recentMessagesList.indexOf(item)
                                ].thumbnail;
                        } else {
                          if (x.type === 1)
                            x.image =
                              environment.image_url +
                              '/' +
                              this.recentMessagesList[
                                this.recentMessagesList.indexOf(item)
                              ].thumbnail;
                          else {
                            x.image =
                              environment.image_url +
                              '/' +
                              _recep_user_val['meta']['pictureURL'];
                          }
                        }
                        return x;
                      });

                      if (this.monitorChatsEnabled) {
                        let nameArr = this.selectedChatData.name.split(
                          "<img class='pl-2 pr-2' src='assets/arrow-icon.svg' alt='->'>"
                        );
                        nameArr[1] = `<img class='pr-2 pl-2 chatImg' src='${
                          environment.image_url +
                          '/' +
                          _recep_user_val['meta']['pictureURL']
                        }' onError="this.src='https://via.placeholder.com/50'"> ${
                          nameArr[1]
                        }`;
                        nameArr[0] = ` <img class='pl-2 pr-2 chatImg' src='${
                          environment.image_url +
                          '/' +
                          this.recentMessagesList[
                            this.recentMessagesList.indexOf(item)
                          ].thumbnail
                        }' onError="this.src='https://via.placeholder.com/50'"> ${
                          nameArr[0]
                        }`;
                        this.selectedChatTitle = nameArr.join(
                          "<img class='pl-2 pr-2' src='assets/arrow-icon.svg' alt='->'>"
                        );
                      }
                    }
                  });
                localMessageList = this._chatHelper.ArraySortByKey(
                  localMessageList,
                  'time'
                ) as Chatmodel[];
                this.messagesHistory = localMessageList;
              }
            }
          });
        }
      } catch (ex) {
        console.error(ex);
      }
      this.isMessagesLoading = false;
    });
  }

  selectAll(args: boolean) {
    this.groupFormArray.controls.map((ctrl: AbstractControl) => {
      ctrl.setValue(args);
      return ctrl;
    });
  }

  changeCategories(categoryName: Object) {
    this.isLoading = true;
    if (this.selectedCategory === 'All') {
      this.tempRecentMessage = this.recentMessagesList;
    }
    this.selectedCategory = categoryName['name'];
    this.recentMessagesList = [new Chatlistmodel()];
    if (categoryName['name'] !== 'All') {
      this._chatService
        .getCompaniesByCategory(categoryName['id'])
        .subscribe((res) => {
          this.isLoading = false;
          let messageArr: Chatlistmodel[] = [];
          if (res) {
            res.forEach((item: any) => {
              let singleComp = this.tempRecentMessage.find(
                (x) => x.id === item.firebase_key
              );
              if (singleComp) {
                messageArr.push(singleComp);
              }
            });
            this.recentMessagesList = messageArr;
          }
        });
    } else {
      this.isLoading = false;
      this.recentMessagesList = this.tempRecentMessage;
    }
  }

  getAllUsers() {
    this.dataService
      .get_WithoutCount('/notification/get_all_users', Users)
      .subscribe(
        async (res: any) => {
          // console.log('userdata list=>', res);
          this.usersList = res;
        },
        (error) => {}
      );
  }
}
