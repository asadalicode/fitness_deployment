import { ChatConstants } from '@app/@shared/constants/chat-constants';
import * as firebase from 'firebase';
// T will be the model type which will be used to push data to firebase and tablename is the Collection's name
// which will be refrenced by the service it is provied at the time of initialization of repository
export class Repository<T> {
  private tableName: string;
  private datasnapShot: firebase.default.database.Database;
  private DbName: string;
  constructor(public _tableName: string, _dbName: string = '_debug') {
    if (firebase.default.apps.length === 0) firebase.default.initializeApp(ChatConstants.firebaseConnectionCreds);
    this.datasnapShot = firebase.default.database();
    this.tableName = _tableName;
    this.DbName = _dbName;
  }

  get getSnapShot() {
    return this.datasnapShot;
  }
  get getCollection(): firebase.default.database.Reference {
    return this.datasnapShot.ref(this.DbName).child(this.tableName);
  }
  Add(model: T): firebase.default.database.ThenableReference {
    console.log(model);
    return this.datasnapShot.ref(this.DbName).child(this.tableName).push(model);
  }
  getChildByKey(key: string): firebase.default.database.Reference {
    return this.datasnapShot.ref(this.DbName).child(this.tableName).child(key);
  }
}
