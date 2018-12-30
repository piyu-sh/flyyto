import LocalForage from "localforage";

class WebStore {

  constructor() {
    LocalForage.config({
        driver : [LocalForage.INDEXEDDB, LocalForage.WEBSQL, LocalForage.LOCALSTORAGE],
        name : 'twFse'
    });
  }

  set(key, value) {
    return LocalForage.setItem(key, value)
            .then(function () {
              return value;
            })
            .catch(this._handleError);
  }

  get(key) {
    return LocalForage.getItem(key)
            .catch(this._handleError);
  }

  remove(key) {
    return LocalForage.removeItem(key)
            .then(() => { return true; })
            .catch(this._handleError);
  }

  clear() {
    return LocalForage.clear()
            .then(() => { return true; })
            .catch(this._handleError);
  }

  setDriver(driver = 'LOCALSTORAGE'){
    LocalForage.setDriver(LocalForage[driver]);
  }

  _handleError(error){
    console.error(error);
  }
}

// exporting a single instance
export let Store = new WebStore();