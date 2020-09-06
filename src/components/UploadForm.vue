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
          העלאת חומרים חדשים
          <v-icon right color="white">mdi-upload</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title>העלאת חומרים פומביים לדרייב</v-card-title>
        <v-card-text>
            תחילה מלאו כמה פרטים על הקובץ
            <v-form v-model="isFormValid">
                <v-autocomplete
                        v-model="courseId"
                        :items="coursesItems"
                        label="קורס"
                        light
                        required
                ></v-autocomplete>
                <v-autocomplete v-if="isCourseChosen"
                        v-model="directory"
                        :items="directories"
                        label="סוג החומר"
                        light
                        required
                >
                </v-autocomplete>
                <UploadInput v-for="header in headers" :key="header.value"
                        :formInputHelper="formDirHelper.getInputHelper(header.value)"
                        :header="header.value"
                        :helperText="header.text"
                >
                </UploadInput>
                <v-file-input show-size label="בחר קובץ"></v-file-input>
            </v-form>
        *הקובץ יופיע באתר רק לאחר אישור אדמיניסטרטור
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            סיימתי
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import {fbValue, isCourseId} from '../misc'
import {FormDirHelper} from '../upload-form-helper'
import UploadInput from './UploadInput'

  export default {
    name: 'UploadForm',
    components: {
        UploadInput
    },
    props: {
        coursesItems : Array,
        headerNames : Object,
    },
    data() {
        return {
            dialog: false,
            courseId: '',
            directory: '',
            isFormValid: false
        }
    },
    computed: {
        isCourseChosen(){return isCourseId(this.courseId)},
        formDirHelper(){
            return new FormDirHelper(this.courseId, this.directory)
        }
    },
    methods: {

    },
    asyncComputed: {
        /**
         * A list of the directories and their names, e.g [{value:'lectures', text:'הרצאות'}, {...}, ...]
         * Used for the type of material autocomplete input
         */
        directories: {
            get(){
                const that = this
                if(!isCourseId(this.courseId))
                    return Promise.resolve([])
                return fbValue('courses/' + this.courseId + '/info/directories')
                       .then((dirs) => dirs.map(dir => ({value:dir, text:that.headerNames[dir]})))
            },
            default: []
        },
        headers: {
            get(){
                if(this.directory == '')
                    return Promise.resolve([])
                return fbValue('headers/' + this.directory).then((headers) => headers.filter(h => h.value != 'fileName'))
            },
            default: []
        }
    }
  }
</script>
