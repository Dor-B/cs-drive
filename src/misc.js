import { db } from "./db"

export class DefaultDict {
    constructor(defaultInit) {
      return new Proxy({}, {
        get: (target, name) => name in target ?
          target[name] :
          (target[name] = typeof defaultInit === 'function' ?
            new defaultInit().valueOf() :
            defaultInit)
      })
    }
  }

  export function isEmpty(obj){
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object
  }

  export function isCourseId(str){
    return str.length > 1 // works for now
  }

  export function fbValue(path){
    return db.ref(path).once('value').then(snap => snap.val())
  }

