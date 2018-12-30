let localStore = {};

const localStorageMock = {
    setItem(key, value) {
      return new Promise(
        function (resolve, reject) {
          try {
            Object.assign(localStore, {[key]: value});
            resolve(localStore[key]);
          } catch (error) {
            reject(error);
          }
        }
      );
    },
    getItem(key) {
      return new Promise(
        function (resolve, reject) {
          try {
            resolve(localStore[key]);
          } catch (error) {
            reject(error);
          }
        }
      );
    },
    removeItem(key) {
      return new Promise(
        function (resolve, reject) {
          try {
            delete localStore[key];
            resolve(true);
          } catch (error) {
            reject(error);
          }
        }
      );
    },
    clear() {
      return new Promise(
        function (resolve, reject) {
          try {
            localStore = {};
            resolve(true);
          } catch (error) {
            reject(error);
          }
        }
      );
    }
};

global.localStorage = localStorageMock;