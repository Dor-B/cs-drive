<template>
  <v-app>
    <link href="https://fonts.googleapis.com/css?family=Material+Icons" rel="stylesheet">
    <v-app-bar
      app
      color="primary"
      dark
      flat
      extended
    >
      <div class="d-flex align-center">
        <v-img
          alt="logo"
          class="shrink mr-2"
          contain
          src="https://scontent.ftlv1-2.fna.fbcdn.net/v/t1.0-9/12140574_882821621786141_2765003736024839187_n.png?_nc_cat=102&_nc_sid=09cbfe&_nc_ohc=lXQfc4kRfKgAX_RTmeD&_nc_ht=scontent.ftlv1-2.fna&oh=b3add9aa4ef99e6afe72357a0e6a3a47&oe=5EF36AA9"
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title>CS Drive</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">העלה חומרים חדשים</span>
        <v-icon>mdi-upload</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-container fluid>
          <v-row justify="center" align="center" style="height:100px">
            <v-col cols="12" sm="4">
              <v-autocomplete
              :items="[1,2,3]"
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
        <!-- <v-col cols="120" sm="4"> -->
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
                  <!-- <v-card-text>{{ item.content }}</v-card-text> -->
                      <FilesDataTable
                      id="table"
                      :headers="headers"
                      :items="items"
                      :title="tableTitle"
                      >
                    </FilesDataTable>
                </v-card>
          </v-card>
        <!-- </v-col> -->
      </v-row>
    </v-container>
    {{coursesNames}}
    {{currentCourseDir}}
  </v-content>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import FilesDataTable from './components/FilesDataTable'
import { isEmpty } from './misc'
import { db } from './db'
// import { firebase } from 'firebase';
// import { ResizeObserver } from 'resize-observer';

export default {
  name: 'App',

  components: {
    FilesDataTable
  },

  data () {
    return {
      coursesNames : [],
      headers : [],
      items: [],
      currentCourseId : '104031',
      currentCourseInfo: {},
      namesMap : {},
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
      return isEmpty(this.currentCourseInfo) ? [] : this.currentCourseInfo.directories.map((name) => {return {name:name, text:this.namesMap[name]}})
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
    }
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
  firebase() {
    return {
      namesMap: db.ref('headers/namesMap'),
    }
  },
  watch: {
    currentCourseDir: {
      immediate: true,
      handler(currentCourseDir) {
        this.$rtdbBind('headers', db.ref('headers/' + this.currentCourseDir))
        this.$rtdbBind('items', db.ref('courses/' + this.currentCourseId + '/directories/' + this.currentCourseDir))
      },
    },
    currentCourseId: {
      immediate: true,
      handler(currentCourseDir) {
        this.$rtdbBind('currentCourseInfo', db.ref('courses/' + this.currentCourseId + '/info'))
        this.$rtdbBind('items', db.ref('courses/' + this.currentCourseId + '/directories/' + this.currentCourseDir))
      },
    },
  },
  created : function(){
    // new ResizeObserver(function(){ 
    //   if (document.createEvent) { // W3C
    //     const ev = document.createEvent('Event');
    //     ev.initEvent('resize', true, true);
    //     window.dispatchEvent(ev);
    //   } else { // IE
    //     document.fireEvent('onresize');
    //   }
    // }).observe(document.getElementById('table'));
  //   firebase.database().ref('/courses').once('value').then(function(snapshot) {
  //       let coursesNames = [];
  //       snapshot.forEach(function(childSnapshot) {
  //         // key will be "ada" the first time and "alan" the second time
  //         coursesNames.push(childSnapshot.key);
  //         // childData will be the actual contents of the child
  //         // var childData = childSnapshot.val();
  //         console.log(childSnapshot.key)
  //       });
  //       this.coursesNames = coursesNames;
  //   });
  } 
}

</script>
