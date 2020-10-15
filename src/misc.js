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
  list = list.map(field => field.toLowerCase())
  let queryList = queryText.toLowerCase().split(' ')
  let matches = queryList.filter(q => list.some(field => field.includes(q))).length
  return matches >= Math.min(queryList.length, list.length)
}

export function getAppsScriptIframeUrl(baseUrl, paramsObj, metaParamsObj){
  let url = new URL(baseUrl);
  for(let [key, data] of Object.entries(paramsObj))
    url.searchParams.append(key, data);
  for(let [key, data] of Object.entries(metaParamsObj))
    url.searchParams.append(`_${key}`, data);
  return url.href
}

export class LocalStorage{
  /**
   * 
   * @param {String} field the name of the field in localStorage used to save the value
   * @param {JSON.stringify compatiable} defaultValue assigned value in case field does not exist in localStorage
   */
  constructor(field, defaultValue=null){
    this.field = field
    let before = localStorage.getItem(field)
    if(before){
      this.value = JSON.parse(before)
    }else{
      this.value = defaultValue
      localStorage.setItem(field, JSON.stringify(this.value))
    }
  }
  get val(){
    return this.value
  }
  set val(newVal){
    localStorage.setItem(this.field, JSON.stringify(newVal))
    this.value = newVal
  }
  /**
   * Returns a computed property for vue component that handles localStorage automatically.
   * You first must set a LocalStorage instance in the component's data,
   *  e.g
   * ```javascript
   * ...
   *  data: {a: new LocalStorage('myList', [])},
   * computed: {l: LocalStorage.getComputedField('a')}
   * ...
   * ```
   * @param {String} localStorageInstanceName if l is LocalStorage instance in vue component (this.l) =>> 'l'
   */
  static getComputedField(localStorageInstanceName){
    return {
      get: function(){return this[localStorageInstanceName].val},
      set: function(val){this[localStorageInstanceName].val = val}
    }
  }
}
