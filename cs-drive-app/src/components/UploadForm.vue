<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on" id="upload-btn">
        <v-icon :left="!isMobile" color="white">mdi-upload</v-icon>
        {{ uploadBtnText }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title>העלאת חומרים פומביים לדרייב</v-card-title>
      <v-card-text>
        שדה חובה*
        <v-form v-model="isFormValid">
          <FileMetadataEditor
            v-model="outputData"
            :coursesItems="coursesItems"
            :headerNames="headerNames"
            :formDirHelper="formDirHelper"
          >
          </FileMetadataEditor>
          <v-checkbox
            v-model="outputData._changeName"
            label="צור שם אוטומטי לפי הנתונים"
            :disabled="outputData.directory == 'auxiliary'"
          >
          </v-checkbox>
          <iframe id="upload-iframe" :src="iframeUrl"></iframe>
        </v-form>
        <v-card-subtitle>
          **הקובץ יופיע באתר רק לאחר אישור אדמיניסטרטור
        </v-card-subtitle>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">
          סיימתי
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { FormDirHelper } from "../upload-form-helper";
import FileMetadataEditor from "./FileMetadataEditor";
import { getAppsScriptIframeUrl } from "../misc";
import { UPLOAD_FILE_APPS_SCRIPT_URL } from "../constants";

export default {
  name: "UploadForm",
  components: {
    FileMetadataEditor
  },
  props: {
    coursesItems: Array,
    headerNames: Object
  },
  data() {
    return {
      dialog: false,
      isFormValid: false,
      outputData: {
        courseId: "",
        directory: "",
        _changeName: false
      },
      fileRules: [v => !!v || "חובה לבחור קובץ"]
    };
  },
  computed: {
    formDirHelper() {
      return new FormDirHelper(
        this.outputData.courseId,
        this.outputData.directory,
        this.outputData
      );
    },
    isMobile() {
      return this.$vuetify.breakpoint.name == "xs";
    },
    uploadBtnText() {
      return this.isMobile ? "" : "העלאת חומרים חדשים";
    },
    iframeUrl() {
      const that = this;
      return getAppsScriptIframeUrl(
        UPLOAD_FILE_APPS_SCRIPT_URL,
        this.outputData,
        { valid: that.isFormValid }
      );
    }
  },
  methods: {
    selectFile(newFile) {
      this.outputData.fileName = newFile.name;
    }
  },
  watch: {
    // outputData: {
    //   handler: function(val){
    //     document.querySelector('#upload-iframe').contentWindow.postMessage(JSON.stringify(val), '*');
    //     console.log('outputData changed')
    //        document.querySelector('#upload-iframe').onload = function(){
    //   console.log('loaded!', document.querySelector('#upload-iframe').contentDocument.dispatchEvent)
    // }
    //   },
    //   deep: true
    // }
  },
  created: function() {
    // document.querySelector('#upload-iframe').onload = function(){
    //   console.log('loaded!', document.querySelector('#upload-iframe').contentDocument.dispatchEvent)
    // }
  }
};
</script>

<style>
/* remove that odd space under the file input */
.file-input .v-text-field__details {
  display: none !important;
}

.v-card__title {
  overflow-wrap: break-word !important;
  word-break: break-word !important;
}

.v-toolbar__content {
  z-index: 100 !important;
  position: relative;
}
</style>

<style scoped>
#upload-iframe {
  overflow: hidden;
  border: none;
  width: 100%;
  height: 100%;
}
</style>
