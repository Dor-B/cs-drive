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
            <UploadApprovalCard :coursesItems="coursesItems" :namesMap="namesMap"></UploadApprovalCard>
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
      coursesItems: Array,
      namesMap: Object
  },

  data () {
    return {

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

<style>
.v-text-field__details{
    display: none;
}
.v-card__title{
    padding-bottom: 0px;
}
</style>
