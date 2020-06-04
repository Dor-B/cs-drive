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
              
            >
              <v-tab
                v-for="item in itemsTabs"
                :key="item.tab"
              >
                {{ item.tab }}
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item
                v-for="item in items"
                :key="item.tab"
              >
                <v-card flat>
                  <!-- <v-card-text>{{ item.content }}</v-card-text> -->
                      <FilesDataTable 
                      :headers="headers"
                      :items="items"
                      :title="tmpTitle"
                      >
                    </FilesDataTable>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        <!-- </v-col> -->
      </v-row>
    </v-container>
    <!-- {{headers}} -->
  </v-content>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import FilesDataTable from './components/FilesDataTable'
import { db } from './db'

export default {
  name: 'App',

  components: {
    FilesDataTable
  },

 data () {
      return {
        headers : [],
        items: [],
        currentCourseId : '234114',
        currentCourseDir : 'lectures',
        tab: null,
        itemsTabs: [
          { tab: 'הרצאות', content: 'Tab 1 Content' },
          { tab: 'תרגילי בית', content: 'Tab 2 Content' },
          { tab: 'סיכומים', content: 'Tab 3 Content' },
        ],
        selected: [],
        tmpTitle: 'מדעי המחשב \\ הרצאות',
        search: '',
      }
    },
  computed: {
    filteredDesserts() {
      return this.desserts.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
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
    return{
      headers: db.ref('headers/' + this.currentCourseDir),
      items: db.ref('courses/' + this.currentCourseId + '/directories/' + this.currentCourseDir)
    }
  }

};
</script>
