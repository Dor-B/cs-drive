<template>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          text
          v-bind="attrs"
          v-on="on"
        >
          העלה חומרים חדשים
          <v-icon left color="white">mdi-upload</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title>העלאת חומרים פומביים לדרייב</v-card-title>
        <v-card-text>
            תחילה מלאו כמה פרטים על הקובץ
            <v-autocomplete
              v-model="courseId"
              :items="coursesItems"
              label="קורס"
              light
        ></v-autocomplete>
        <v-autocomplete v-if="isCourseChosen"
          v-model="directory"
          :items="directories"
          label="סוג החומר"
          light
        >
        </v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import {fbValue, isCourseId} from '../misc'
// import { db } from '../db'
  export default {
    name: 'UploadForm',
    props: {
        coursesItems : Array,
        headerNames : Object
    },
    data() {
        return {
            dialog: false,
            courseId: String,
            directory: String
        }
    },
    computed: {
        isCourseChosen(){return isCourseId(this.courseId)}
    },
    methods: {

    },
    asyncComputed: {
        directories: {
            get(){
                const that = this
                if(!isCourseId(this.courseId))
                    return Promise.resolve([])
                return fbValue('courses/' + this.courseId + '/info/directories')
                       .then((dirs) => dirs.map(dir => ({value:dir, text:that.headerNames[dir]})))
            },
            default:[]
        }
    }
  }
</script>
