<template>
<div>
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
    <v-app-bar
      app
      color="primary"
      dark
      flat
      class="toolbar"
    >
      <div class="d-flex align-center">

        <v-toolbar-title>CS Drive Admin</v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click="login()"
      >
      <v-icon left>mdi-account</v-icon>
      התחבר 
      </v-btn>
      <h4>{{signedUserText}}</h4>
    </v-app-bar>
  <v-content>
    <v-btn @click="test()">
      TEST
    </v-btn>
    <v-container fluid class="grey lighten-4">
      <v-checkbox 
        v-model="byCourse"
        label="הצג קורס ספציפי"
      >
      </v-checkbox>
      <v-autocomplete
        v-if="byCourse"
        id="course-select"
        v-model="courseId"
        :items="coursesItems"
        label="בחר קורס"
        light
      ></v-autocomplete>

      <template v-for="(fileData, fileKey) in filteredFiles">
        <v-row dense justify="center" align="center" :key="fileKey" class="card-row">
            <UploadApprovalCard
             :dbKey="fileKey"
             :fileData="fileData"
             :coursesItems="coursesItems"
             :namesMap="namesMap"
             :user="user"
            ></UploadApprovalCard>
        </v-row>
      </template>
    </v-container>
  </v-content>
</div>
</template>

<script>
import UploadApprovalCard from './components/UploadApprovalCard'
import { fbValue, filterObject } from './misc'
import { db } from './db'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions'

// var functions = firebase.functions();

export default {
  name: 'Admin',

  components:{
      UploadApprovalCard
  },

  props:{
      coursesItems: Array,
      namesMap: Object
  },

  data () {
    return {
      byCourse: false,
      courseId: '',
      user:null,
      userError:{message: 'לא מחובר'},
    }
  },

  computed: {
    filteredFiles(){
      if(!this.byCourse)
        return this.filesDataList
      const that = this
      return filterObject(this.filesDataList, (fileData) => fileData.courseId == that.courseId)
    },
    signedUserText(){
      return this.user == null ? this.userError.message : this.user.displayName
    }
  },

  methods: {
    test(){
      let test = firebase.functions().httpsCallable('test1');
      test({text: 'messageText'}).then(function(result) {
        console.log(result)
      });
    },
    login(){
      const that = this
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        that.user = user
        console.log(user);
        // ...
      }).catch(function(error) {
        that.user = null
        that.userError = error
        // console.log(error);
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // ...
      });
    }
  },
  asyncComputed: {
    filesDataList: {
      get(){
        return fbValue('forApproval')
      },
      default: {}
    }
  },
  
  created : function(){
    const that = this
    db.ref('/forApproval').on('child_removed', function(childSnapshot){
      delete that.filesDataList[childSnapshot.key]
    })
  } 
}

</script>

<style>
.v-text-field__details{
    display: none;
}
.v-card__title{
    padding-bottom: 0px;
}
.card-row{
  margin-bottom: 10px;
}
#course-select{
  max-width: 500px !important;
}
</style>
