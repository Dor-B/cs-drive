<template>
  <v-app>
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
        <!-- <v-img
          alt="logo"
          class="shrink mr-2"
          contain
          src="https://scontent.ftlv1-2.fna.fbcdn.net/v/t1.0-9/12140574_882821621786141_2765003736024839187_n.png?_nc_cat=102&_nc_sid=09cbfe&_nc_ohc=lXQfc4kRfKgAX_RTmeD&_nc_ht=scontent.ftlv1-2.fna&oh=b3add9aa4ef99e6afe72357a0e6a3a47&oe=5EF36AA9"
          transition="scale-transition"
          width="40"
        /> -->

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
  </v-app>
</template>

<script>

import FilesDataTable from './components/FilesDataTable'
import UploadForm from './components/UploadForm'
import { isEmpty, fbValue } from './misc'
import { db } from './db'


export default {
  name: 'App',

  components: {
    FilesDataTable,
    UploadForm
  },

  data () {
    return {
      coursesIDs : [],
      coursesItems : [],
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
    // console.log('courses/' + this.currentCourseId + '/directories/' + this.currentCourseDir)
    // this.$rtdbBind('items', db.ref('courses/' + this.currentCourseId + '/directories/' + this.currentCourseDir))
    // setInterval(()=> {this.x++}, 1000);
    const that = this;
    db.ref('/courses').once('value').then(function(snapshot) {
        let coursesItems = [];
        snapshot.forEach(function(childSnapshot) {
          let text = childSnapshot.child('info').child('name').val() + " - " + childSnapshot.key
          coursesItems.push({value: childSnapshot.key, text:text});
          console.log(childSnapshot.key)
        });
        that.coursesItems = coursesItems;
    });
  } 
}

</script>
