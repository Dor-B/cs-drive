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

    </v-app-bar>
  <v-content>

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
      courseId: ''
    }
  },

  computed: {
    filteredFiles(){
      if(!this.byCourse)
        return this.filesDataList
      const that = this
      return filterObject(this.filesDataList, (fileData) => fileData.courseId == that.courseId)
    }
  },

  methods: {

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
