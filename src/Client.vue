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
      <TutorialDialog
       v-if="!isMobile"
       :coursesItems="coursesItemsByLastSeen"
       :headerNames="namesMap"
       :defaultVisibillity="isFirstTimeVisit"
      >
      </TutorialDialog>
      <v-menu
          bottom
          left
          transition="scale-transition"
          origin="top left"
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
              <v-list-item id="feedback-menu-item" @click="openFeedback()">
                <v-list-item-icon><v-icon>mdi-comment-alert</v-icon></v-list-item-icon>
                <v-list-item-title>פידבק</v-list-item-title>
              </v-list-item>
              <v-list-item id="google-drive-menu-item" @click="openGoogleDrive()">
                <v-list-item-icon><v-icon>mdi-google-drive</v-icon></v-list-item-icon>
                <v-list-item-title>גוגל דרייב</v-list-item-title>
              </v-list-item>
              <v-list-item id="old-exams-menu-item" @click="openOldDrive()">
                <v-list-item-icon><v-icon>mdi-google-drive</v-icon></v-list-item-icon>
                <v-list-item-title>מבחנים ישנים</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title> - ועד מדעי המחשב בטכניון - </v-list-item-title>
              </v-list-item>
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
              :loading="coursesItemsByLastSeen.length == 0"
              :menu-props="{maxHeight: 355}"
            ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-app-bar>
<!-- <v-main> -->
  <v-main>
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
          :loading="coursesItemsByLastSeen.length == 0"
        ></v-autocomplete>
        </v-col>
      </v-row> 

      <v-row justify="center" align="center" :class="{'desktop-table-row': !isMobile}">
        <!-- <v-expand-transition> -->
        <div :class="{fullWidth: isMobile}">
          <v-card :elevation="isMobile? '1' : '4'" v-if="items.length > 0">
            <!-- {{tab}} -->
            <div id="tabs-container">
              <v-tabs
                v-model="tab_"
                hide-slider
                show-arrows
                center-active
              >
                <v-tab
                  v-for="(item, i) in tabs"
                  :key="i"
                >
                  {{ item.text }}
                </v-tab>
              </v-tabs>
              <v-tooltip bottom v-if="!isMobile">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn :href="tscans_url" target="_blank"
                    depressed
                    large
                    color="white"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon left>mdi-open-in-new</v-icon>
                    סריקות
                  </v-btn>
                </template>
                <span>אתר tscans</span>
              </v-tooltip>
            </div>
                <v-card flat>
                      <div style="display: flex; justify-content: flex-end; padding:2px;">
                        <v-btn rounded depressed small v-if="isMobile" :href="tscans_url" target="_blank">
                          <v-icon left small>mdi-open-in-new</v-icon>
                          סריקות
                        </v-btn>
                      </div>
                      <FilesDataTable
                        v-if="tab < tabs.length"
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
        </div>
      </v-row>
      
    </v-container>
  </v-main>
  <!-- </v-main>
  <v-footer app>
    HEECCE
  </v-footer> -->
  
</div>
</template>

<script>

import FilesDataTable from './components/FilesDataTable'
import UploadForm from './components/UploadForm'
import TutorialDialog from './components/TutorialDialog'
import { isEmpty, fbValue, LocalStorage } from './misc'
import { FEEDBACK_URL, OLD_DRIVE_URL, GOOGLE_DRIVE_URL, TSCANS_URL_COURSE, DEFAULT_COURSE_ID} from './constants'

const COL_WIDTHS = {
  'fileName' : '250px',
  'icon': '200px',
}

const NUM_LAST_COURSES = 6
const LAST_COURSES_DIVIDER = 'קורסים אחרונים'

export default {
  name: 'Client',

  props:{
      coursesItems: Array,
      namesMap: Object
  },

  components: {
    FilesDataTable,
    UploadForm,
    TutorialDialog
  },

  data () {
    return {
      coursesIDs : [],
      currentCourseId : DEFAULT_COURSE_ID, // IMPORTANT: do not change to '' !!!
      tab: 0,
      tab_: 0, // might be exams (out of range of tabs)
      selected: [],
      tmpTitle: 'מדעי המחשב \\ הרצאות',
      search: '',
      iconHover: false,
      iconClick: false,
      LS_lastCourses: new LocalStorage('lastCourses', []),
      LS_isFirstTimeVisit: new LocalStorage('isFirstTimeVisit', false),
      feedbackUrl: FEEDBACK_URL,
      oldDriveUrl: OLD_DRIVE_URL,
      googleDriveUrl: GOOGLE_DRIVE_URL,
    }
  },

  computed: {
    isFirstTimeVisit: LocalStorage.getComputedField('LS_isFirstTimeVisit'),
    lastCourses: LocalStorage.getComputedField('LS_lastCourses'),
    coursesItemsByLastSeen: function(){
      if(this.coursesItems.length == 0)
        return []
      const that = this
      let lastSeenItems = [...this.lastCourses].sort().map(id => that.coursesItems.filter(i => i.value == id)[0])
      let otherItems = this.coursesItems.filter(item => !that.lastCourses.includes(item.value))

      return [{ header: LAST_COURSES_DIVIDER }, ...lastSeenItems, { divider: true }, ...otherItems]
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
    tscans_url: function(){
      return TSCANS_URL_COURSE + this.currentCourseId
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
    mobileCourseSearchChange(){
      document.querySelector('.mobile-course-search input').blur()
    },
    openFeedback(){
      window.open(this.feedbackUrl)
    },
    openOldDrive(){
      window.open(this.oldDriveUrl)
    },
    openGoogleDrive(){
      window.open(this.googleDriveUrl)
    }
  },
  watch: {
    currentCourseId: function(newCourse){
      if(newCourse != null){
        this.lastCourses = [newCourse, ...this.lastCourses.filter(c => c != newCourse)].slice(0, NUM_LAST_COURSES)
      }
    },
    tab_: function(newTab){
      if (newTab < this.tabs.length)
        this.tab = newTab
    },
    coursesItems: function(newCoursesItems){
      // remove lastCourses which do not exist
      const knownCourses = newCoursesItems.map(item => item.value)
      if(knownCourses.length > 0){
        this.lastCourses = this.lastCourses.filter(courseId => knownCourses.includes(courseId))
        if(!knownCourses.includes(this.currentCourseId)){
          this.currentCourseId = this.lastCourses[0] || DEFAULT_COURSE_ID
        }
      }
    }
  },
  asyncComputed: {
    items :{
        get(){
          const dir = this.currentCourseDir
          return fbValue('courses/' + this.currentCourseId + '/directories')
          .then(dirs => {
             if(!dirs || (dirs === null))
              return []
              return dirs[dir]
            })
          .then(obj => {
            if(!obj || (obj === null))
              return []
            return Object.entries(obj).map(([key, item]) => ({...item, key}))
          })
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
          // return db.ref('courses/' + this.currentCourseId + '/directories').once('value').then(snap => {
          //   let activeDirs = []
          //   snap.forEach(childSnap => {activeDirs.push([childSnap.key, childSnap.numChildren()])})
          //   return Promise.all(activeDirs)
          // }).then(listActive => Object.fromEntries(listActive))
          return fbValue('courses/' + this.currentCourseId + '/directories/')
          .then(dir => {
            if(!dir)
              return {}
            let ret = Object.fromEntries(
              Object.entries(dir).map(([key, data]) => [key, Object.keys(data).length])
            )
            return ret
          })
        },
        default: {}
    }
  },
  
  created : function(){
    // const knownCourses = this.coursesItems.map(item => item.value)
    // console.log('last courses', this.lastCourses)
    
    if(this.lastCourses.length == 0){
      this.isFirstTimeVisit = true
      this.lastCourses = [this.currentCourseId]
    }else{
      this.isFirstTimeVisit = false
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

.v-input__icon--append{
  cursor: pointer;
}
</style>

<style scoped>
#mobile-tscans-link{
  margin-left: auto; 
  margin-right: 0;
}

.fullWidth{
    width: 100%;
    max-width: 100%;
}

#tabs-container{
  display: flex;
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
