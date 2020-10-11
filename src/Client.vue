<template>
<div>
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
    <v-app-bar
      app
      color="primary"
      dark
      :flat="!isMobile"
      :extended="!isMobile"
      class="toolbar"
    >
      <div class="d-flex align-center">

        <v-toolbar-title>
          <img
           id="logo"
           src="./graphics/duck-logo.svg"
           @mousedown="iconClick = true"
           @mouseup="iconClick = false"
           @mouseenter="iconHover = true"
           @mouseleave="iconHover = false; iconClick = false;"
           :class="{ iconRotate: iconHover, iconSqueeze: iconClick }"
           />
          CS Drive 
        </v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <UploadForm
       :coursesItems="coursesItems"
       :headerNames="namesMap"
      >
      </UploadForm>
      <!-- Desktop course search inside toolbar -->
      <template v-slot:extension v-if="!isMobile">
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
<!-- <v-main> -->
  <v-content>
    <v-container fill-height fluid class="grey lighten-4">
      <!-- Mobile course search at top of content -->
      <v-row justify="center" align="center" v-if="isMobile" class="mobile-course-search">
        <v-col cols="12" sm="4">
          <v-autocomplete
          v-model="currentCourseId"
          :items="coursesItems"
          @change="mobileCourseSearchChange()"
          label="בחר קורס"
          solo
          light
          flat
        ></v-autocomplete>
        </v-col>
      </v-row>

      <v-row justify="center" align="center" :class="{'desktop-table-row': !isMobile}">
        <v-expand-transition>
          <v-card :elevation="isMobile? '1' : '4'" :class="{fullWidth: isMobile}">
            <v-tabs
              v-model="tab"
              hide-slider
              show-arrows
              center-active
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
  <!-- </v-main>
  <v-footer app>
    HEECCE
  </v-footer> -->
</div>
</template>

<script>

import FilesDataTable from './components/FilesDataTable'
import UploadForm from './components/UploadForm'
import { isEmpty, fbValue } from './misc'
import { db } from './db'

const FILENAME_COL_WIDTH = '200px'

export default {
  name: 'Client',

  props:{
      coursesItems: Array,
      namesMap: Object
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
      iconHover: false,
      iconClick: false
    }
  },

  computed: {
    tableTitle: function(){
      if(isEmpty(this.currentCourseInfo) || isEmpty(this.namesMap) || this.isMobile){
        return ''
      }
      return this.currentCourseInfo.name + ' - ' + this.currentCourseId + ' \\ ' + this.namesMap[this.currentCourseDir]
    },
    
    tabs : function(){
      if(isEmpty(this.currentCourseInfo) || !('directories' in this.currentCourseInfo))
        return []
      const that = this
      // filter only tabs with 1 or more files
      return this.currentCourseInfo.directories.filter(name => name in that.dirsNumChildren && that.dirsNumChildren[name] > 0)
      .map((name) => {return {name:name, text:this.namesMap[name]}})
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
    isMobile(){
      return this.$vuetify.breakpoint.name == 'xs'
    },
  },

  methods: {
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.desserts.slice()
    },
    columnValueList(val) {
      return this.desserts.map(d => d[val])
    },
    mobileCourseSearchChange(){
      document.querySelector('.mobile-course-search input').blur()
    }
  },
  asyncComputed: {
    items :{
        get(){
          return fbValue('courses/' + this.currentCourseId + '/directories/' + this.currentCourseDir).then(obj => Object.values(obj))
        },
        default:[]
    },
    headers:{
        get(){
          return fbValue('headers/' + this.currentCourseDir)
          .then(hs => hs.map(h => h.value == 'fileName' ? {width:FILENAME_COL_WIDTH, ...h} : h))
        },
        default:[]
    },
    currentCourseInfo: {
        get(){
          return fbValue('courses/' + this.currentCourseId + '/info')
        },
        default: {}
    },
    dirsNumChildren: {
        get(){
          return db.ref('courses/' + this.currentCourseId + '/directories').once('value').then(snap => {
            let activeDirs = []
            snap.forEach(childSnap => {activeDirs.push([childSnap.key, childSnap.numChildren()])})
            return Promise.all(activeDirs)
          }).then(listActive => Object.fromEntries(listActive))
        },
        default: {}
    }
  },
  
  created : function(){

  } 
}

</script>

<style>
.mobile-course-search .v-text-field__details{
    display: none !important;
}

.desktop-table-row{
  margin-top: 20px;
}
</style>

<style scoped>

.fullWidth{
    width: 100%;
}
#logo{
  position: relative;
  width: 23px;
  height: 23px;
  /* margin-left: -2px; */
  top: 2px;
  transition: 1s;
}
#logo:hover{
  /* transform: scaleY(0.8); */
  transform: rotate(360deg);
}
.iconRotate {
  /* transition: 0.3s !important;
  transform: scaleY(0.8) !important;
    transform-origin: bottom !important; */
    /* animation:spin 1s ease-in-out; */
}

@keyframes spin { 
    100% {transform:rotate(360deg); } 
}
.iconSqueeze {
    transform-origin: bottom !important;
    transform:scaleY(0.8) !important;
    animation:squeeze 0.3s ease-in-out;
}

@keyframes squeeze {
    0% {transform:scaleY(1); transform-origin: bottom;}
    100% {transform:scaleY(0.8); transform-origin: bottom; } 
}
</style>
