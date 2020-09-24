<template>
<div>
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
    <v-app-bar
      app
      color="primary"
      dark
      flat
      extended
      class="toolbar"
    >
      <div class="d-flex align-center">

        <v-toolbar-title>CS Drive</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <UploadForm
       :coursesItems="coursesItems"
       :headerNames="namesMap"
      >
      </UploadForm>
      <template v-slot:extension>
        <v-container fluid>
          <v-row justify="center" align="center" style="height:100px">
            <v-col cols="12" sm="4">
              <v-autocomplete
              v-model="currentCourseId"
              :items="coursesItems"
              label="בחר קורס"
              solo
              light
            ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-app-bar>
  <v-content>
    <v-container fluid class="grey lighten-4">
      <v-row justify="center" align="center" style="margin-top:20px;">
        <v-expand-transition>
          <v-card elevation="4">
            <v-tabs
              v-model="tab"
              hide-slider
            >
              <v-tab
                v-for="item in tabs"
                :key="item.tab"
              >
                {{ item.text }}
              </v-tab>
            </v-tabs>
                <v-card flat>
                      <FilesDataTable
                      id="table"
                      :headers="headers"
                      :items="items"
                      :title="tableTitle"
                      :loading="$asyncComputed.items.updating"
                      >
                    </FilesDataTable>
                </v-card>
          </v-card>
        </v-expand-transition>
      </v-row>
    </v-container>
  </v-content>
</div>
</template>

<script>

import FilesDataTable from './components/FilesDataTable'
import UploadForm from './components/UploadForm'
import { isEmpty, fbValue } from './misc'


export default {
  name: 'Client',

  props:{
      coursesItems: Array
  },

  components: {
    FilesDataTable,
    UploadForm
  },

  data () {
    return {
      coursesIDs : [],
      currentCourseId : '234114',
      tab: 0,
      selected: [],
      tmpTitle: 'מדעי המחשב \\ הרצאות',
      search: '',
    }
  },

  computed: {
    tableTitle: function(){
      return ((!isEmpty(this.currentCourseInfo)) && (!isEmpty(this.namesMap))) ? 
              this.currentCourseInfo.name + ' - ' + this.currentCourseId + ' \\ ' + this.namesMap[this.currentCourseDir] : ''
    },
    
    tabs : function(){
        // return this.currentCourseInfo.directories.map((name) => {return {name:name, text:this.namesMap[name]}})
      return (isEmpty(this.currentCourseInfo) || !('directories' in this.currentCourseInfo))  ? [] : this.currentCourseInfo.directories.map((name) => {return {name:name, text:this.namesMap[name]}})
    },

    currentCourseDir : function(){
      // return 'lectures'
      let res
      try{
        res = this.tabs[this.tab]['name']
      }catch(err){
        return 'lectures'
      }
      return res;
    },
  },

  methods: {
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.desserts.slice()
    },
    columnValueList(val) {
      return this.desserts.map(d => d[val])
    }
  },
  asyncComputed: {
    items :{
        get(){
          return fbValue('courses/' + this.currentCourseId + '/directories/' + this.currentCourseDir)
        },
        default:[]
    },
    namesMap:{
      get(){
        return fbValue('headers/namesMap')
      },
      default:{}
    },
    headers:{
        get(){
          return fbValue('headers/' + this.currentCourseDir)
        },
        default:[]
    },
    currentCourseInfo: {
        get(){
          return fbValue('courses/' + this.currentCourseId + '/info')
        },
        default: {}
    },
  },
  
  created : function(){

  } 
}

</script>
