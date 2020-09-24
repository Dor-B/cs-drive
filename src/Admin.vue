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
        <v-row justify="center" align="center">
            <UploadApprovalCard v-model="tdata" :coursesItems="coursesItems"></UploadApprovalCard>
        </v-row>
    </v-container>
  </v-content>
</div>
</template>

<script>
import UploadApprovalCard from './components/UploadApprovalCard'

export default {
  name: 'Admin',

  components:{
      UploadApprovalCard
  },

  props:{
      coursesItems: Array
  },

  data () {
    return {
        tdata: {
            'courseId':'234114',
            'directory': 'lectures',
            'driveId': '1th1myHph72HdZ2GLGPr-t0Kb6Zn2dLQm',
            'semester': 'אביב',
            'number': '3',
            'fileName': 'קובץ בדיקה'
        }
    }
  },

  computed: {

  },

  methods: {

  },
  asyncComputed: {

  },
  
  created : function(){

  } 
}

</script>
