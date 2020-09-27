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

  export function isNonEmptyStr(str){
    return (str != undefined) && str.length > 1 // works for now
  }

  /**
   * returns a Promise with database's value in path parameter
   */
  export function fbValue(path){
    return db.ref(path).once('value').then(snap => snap.val())
  }

  export function getFbCourseDirectories(courseId){
    if(!isNonEmptyStr(courseId))
        return Promise.resolve([])
    return fbValue('courses/' + courseId + '/info/directories')
  }

export function filterObject(obj, predicate){
  let result = {}, key;

  for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && predicate(obj[key])) {
          result[key] = obj[key];
      }
  }

  return result;
}

/**
 * returns a promise after t SECONDS
 */
export function delay(t, v) {
  return new Promise(function(resolve) { 
      setTimeout(resolve.bind(null, v), t*1000)
  });
}

/**
 * returns whether the queryText (which is a string separated by spaces) matches the list of strings
 */
export function isListMatchingQuery(queryText, list){
  let queryList = queryText.split(' ').sort()
  let listSorted = list.sort()
  let len = Math.min(queryList.length, listSorted.length)
  let matches = 0
  for (let i = 0; i < len; i++) {
    if(queryList[i] == listSorted[i])
      matches++
  }
  return matches == len
}

