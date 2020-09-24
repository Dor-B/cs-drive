<template>
    <v-dialog
      v-model="dialog"
      width="500"
    >
    <!-- <link href="upload-form.css" rel="stylesheet"> -->
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          text
          v-bind="attrs"
          v-on="on"
          id="upload-btn"
        >
        <v-icon left color="white">mdi-upload</v-icon>
          העלאת חומרים חדשים
        </v-btn>
      </template>

      <v-card>
        <v-card-title>העלאת חומרים פומביים לדרייב</v-card-title>
        <v-card-text>
            <!-- בחרו קובץ ומלאו כמה פרטים עליו -->
            <v-form v-model="isFormValid">
                <v-file-input outlined dense show-size label="קובץ להעלאה" required
                :rules="fileRules"
                class="file-input"
                ></v-file-input>
                <v-autocomplete
                        v-model="courseId"
                        :items="coursesItems"
                        label="קורס"
                        light
                        required
                        :rules="courseRules"
                ></v-autocomplete>
                <v-autocomplete v-if="isCourseChosen"
                        v-model="directory"
                        :items="directories"
                        label="סוג החומר"
                        light
                        required
                        :rules="directoryRules"
                >
                </v-autocomplete>
                <UploadInput v-for="header in headers" :key="header.value"
                        v-model="outputData[header.value]"
                        :formInputHelper="formDirHelper.getInputHelper(header.value)"
                        :header="header.value"
                        :helperText="header.text"
                >
                </UploadInput>
            </v-form>
            <v-btn depressed large color="primary" :disabled="!isFormValid">
               <v-icon left>mdi-upload</v-icon>
                העלה
            </v-btn>
        <v-card-subtitle>
        *הקובץ יופיע באתר רק לאחר אישור אדמיניסטרטור
        </v-card-subtitle>
        <!-- {{outputData}} -->
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
import {fbValue, isNonEmptyStr, getFbCourseDirectories} from '../misc'
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
            isFormValid: false,
            outputData : {},
            fileRules: [
                v => !!v || 'חובה לבחור קובץ',
            ],
            courseRules: [
                v => !!v || 'חובה לבחור קורס',
            ],
            directoryRules: [
                v => !!v || 'חובה לבחור סוג חומר',
            ]
        }
    },
    computed: {
        isCourseChosen(){return isNonEmptyStr(this.courseId)},
        formDirHelper(){
            return new FormDirHelper(this.courseId, this.directory, this.outputData)
        }
    },
    methods: {

    },
    watch: {
        headers: function(newHeaders){
            // clean up items that are not in the new headers
            let resOutputData = {}
            const that = this
            newHeaders.map(h => h.value).concat(['courseId', 'directory']).forEach(header => {
                resOutputData[header] = that.outputData[header]
            });
            this.outputData = resOutputData
        },
        courseId: function(val){
            // that's shit but it's too late in the evening
            this.outputData.courseId = val
        },
        directory: function(val){
            // that's shit but it's too late in the evening
            this.outputData.directory = val
        }
    },
    asyncComputed: {
        /**
         * A list of the directories and their names, e.g [{value:'lectures', text:'הרצאות'}, {...}, ...]
         * Used for the type of material autocomplete input
         */
        directories: {
            get(){
                const that = this
                return getFbCourseDirectories(this.courseId)
                       .then((dirs) => dirs.map(dir => ({value:dir, text:that.headerNames[dir]})))
            },
            default: []
        },
        headers: {
            get(){
                if(!isNonEmptyStr(this.directory))
                    return Promise.resolve([])
                return fbValue('headers/' + this.directory).then((headers) => headers.filter(h => h.value != 'fileName'))
            },
            default: []
        }
    }
  }
</script>

<style>
/* remove that odd space under the file input */
.file-input .v-text-field__details{
    display: none !important;
}

.v-toolbar__content{
    z-index: 100 !important;
    position: relative;
}
</style>
