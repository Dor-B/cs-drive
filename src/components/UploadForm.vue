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
                @change="selectFile"
                class="file-input"
                ></v-file-input>
            <FileMetadataEditor
                v-model="outputData"
                :coursesItems="coursesItems"
                :headerNames="headerNames"
                :formDirHelper="formDirHelper"
            >
            </FileMetadataEditor>
            </v-form>
            <v-btn depressed large color="primary" :disabled="!isFormValid">
               <v-icon left>mdi-upload</v-icon>
                העלה
            </v-btn>
        <v-card-subtitle>
        *הקובץ יופיע באתר רק לאחר אישור אדמיניסטרטור
        </v-card-subtitle>
        <!-- {{outputData.fileName}} -->
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
import {FormDirHelper} from '../upload-form-helper'
import FileMetadataEditor from './FileMetadataEditor'

  export default {
    name: 'UploadForm',
    components: {
        FileMetadataEditor
    },
    props: {
        coursesItems : Array,
        headerNames : Object,
    },
    data() {
        return {
            dialog: false,
            isFormValid: false,
            outputData : {
                courseId: '',
                directory: '',
            },
            fileRules: [
                v => !!v || 'חובה לבחור קובץ',
            ],
        }
    },
    computed: {
        formDirHelper(){
            return new FormDirHelper(this.outputData.courseId, this.outputData.directory, this.outputData)
        }
    },
    methods: {
        selectFile(newFile){
            this.outputData.fileName = newFile.name
        }
    },
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
