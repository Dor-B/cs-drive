// Conveniently import this file anywhere to use db

import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/analytics'

const fb = firebase
.initializeApp({
    apiKey: "AIzaSyCguQreALBDnfJgWrf1OLyWa-PJjePlv2g",
    authDomain: "technion-cs-drive.firebaseapp.com",
    databaseURL: "https://technion-cs-drive.firebaseio.com",
    projectId: "technion-cs-drive",
    storageBucket: "technion-cs-drive.appspot.com",
    messagingSenderId: "1082094948369",
    appId: "1:1082094948369:web:4697c08eb0ec9b471fa1b0",
    measurementId: "G-2BREK6ESM2"
  })
export const db = fb.database()
export const analytics = firebase.analytics()


// Export types that exists in Firestore - Uncomment if you need them in your app
// const { Timestamp, GeoPoint } = firebase.firestore
// export { Timestamp, GeoPoint }
