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
          id="upload-btn"
        >
        <v-icon :left="!isMobile" color="white">mdi-upload</v-icon>
        {{uploadBtnText}}
        </v-btn>
      </template>

      <v-card>
        <v-card-title>העלאת חומרים פומביים לדרייב</v-card-title>
        <v-card-text>
            <!-- בחרו קובץ ומלאו כמה פרטים עליו -->
            <v-form v-model="isFormValid">
                <iframe id="upload-iframe" :src="iframeUrl" style="border:none;width:100%;height:100%;"></iframe>
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
        {{iframeUrl}}
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
        },
        isMobile(){
            return this.$vuetify.breakpoint.name == 'xs'
        },
        uploadBtnText(){
            return this.isMobile ? '' : 'העלאת חומרים חדשים'
        },
        iframeUrl(){
          var url = new URL("https://script.google.com/macros/s/AKfycbzhkE8gwCcmUeZiHW_D2ad2A5xR7XVEnzttyANgoootjE2cieRy/exec");
          // If your expected result is "http://foo.bar/?x=1&y=2&x=42"
          for(let [key, data] of Object.entries(this.outputData))
            url.searchParams.append(key, data);
          return url.href
        }
    },
    methods: {
        selectFile(newFile){
            this.outputData.fileName = newFile.name
        }
    },
    watch: {
      outputData: {
        handler: function(val){
          document.querySelector('#upload-iframe').contentWindow.postMessage(JSON.stringify(val), '*');
          console.log('outputData changed')
             document.querySelector('#upload-iframe').onload = function(){
        console.log('loaded!', document.querySelector('#upload-iframe').contentDocument.dispatchEvent)
      }
        },
        deep: true
      }
    },
    created: function(){
      // document.querySelector('#upload-iframe').onload = function(){
      //   console.log('loaded!', document.querySelector('#upload-iframe').contentDocument.dispatchEvent)
      // }
    }
  }
</script>

<style>
/* remove that odd space under the file input */
.file-input .v-text-field__details{
    display: none !important;
}

.v-card__title{
    overflow-wrap: break-word !important;
    word-break: break-word !important;
}

.v-toolbar__content{
    z-index: 100 !important;
    position: relative;
}

</style>
