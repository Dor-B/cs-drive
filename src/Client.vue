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
       :coursesItems="coursesItemsByLastSeen"
       :headerNames="namesMap"
      >
      </UploadForm>
      <v-menu
          bottom
          left
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              dark
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <!-- <a :href="feedbackUrl"> -->
              <v-list-item id="feedback-menu-item" @click="openFeedback()">
                <v-list-item-icon><v-icon>mdi-comment-alert</v-icon></v-list-item-icon>
                <v-list-item-title>פידבק</v-list-item-title>
              </v-list-item>
            <!-- </a> -->
          </v-list>
      </v-menu>
      <!-- Desktop course search inside toolbar -->
      <template v-slot:extension v-if="!isMobile">
        <v-container fluid>
          <v-row justify="center" align="center" style="height:100px">
            <v-col cols="12" sm="4">
              <v-autocomplete
              v-model="currentCourseId"
              :items="coursesItemsByLastSeen"
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
          :items="coursesItemsByLastSeen"
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
          <v-card :elevation="isMobile? '1' : '4'" :class="{fullWidth: isMobile}" v-if="courseHasItems">
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
          <p v-else>אין עדיין קבצים בקורס זה, בואו לתרום ולעלות קבצים דרך הכפתור משמאל למעלה!</p>
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
import { isEmpty, fbValue, fbPathHasChild, LocalStorage } from './misc'
import { db } from './db'
import { FEEDBACK_URL } from './constants'

const COL_WIDTHS = {
  'fileName' : '250px',
  'icon': '200px',
}

const NUM_LAST_COURSES = 6


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
      currentCourseId : '888888',
      tab: 0,
      selected: [],
      tmpTitle: 'מדעי המחשב \\ הרצאות',
      search: '',
      iconHover: false,
      iconClick: false,
      LS_lastCourses: new LocalStorage('lastCourses', []),
      feedbackUrl: FEEDBACK_URL,
    }
  },

  computed: {
    lastCourses: LocalStorage.getComputedField('LS_lastCourses'),
    coursesItemsByLastSeen: function(){
      const that = this
      let lastSeenItems = [...this.lastCourses].sort().map(id => that.coursesItems.filter(i => i.value == id)[0])
      let otherItems = this.coursesItems.filter(item => !that.lastCourses.includes(item.value))
      return [...lastSeenItems, ...otherItems]
    },
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
    },
    openFeedback(){
      window.open(this.feedbackUrl)
    }
  },
  watch: {
    currentCourseId: function(newCourse){
      if(newCourse != null){
        this.lastCourses = [newCourse, ...this.lastCourses.filter(c => c != newCourse)].slice(0, NUM_LAST_COURSES)
      }
    }
  },
  asyncComputed: {
    courseHasItems: {
      get(){
          return fbPathHasChild('courses/' + this.currentCourseId, 'directories')
        },
        default:true
    },
    items :{
        get(){
          return fbValue('courses/' + this.currentCourseId + '/directories/' + this.currentCourseDir).then(obj => Object.values(obj))
        },
        default:[]
    },
    headers:{
        get(){
          const getWidth = (headerValue) => COL_WIDTHS[headerValue] ? {width: COL_WIDTHS[headerValue]} : {} 
          return fbValue('headers/' + this.currentCourseDir)
          .then(hs =>
           hs.map(h => ({...getWidth(h.value), ...h}))
          )
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
    if(this.lastCourses.length > 0){
      this.currentCourseId = this.lastCourses[0]
    }
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

a #feedback-menu-item{
  font-weight:normal !important;
  text-decoration:none !important;
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
