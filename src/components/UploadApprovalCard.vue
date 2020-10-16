<template>
<div>
    <v-card v-if="showComponent">
        <v-card-title>
            <a target="_blank" rel="noopener noreferrer" :href="fileUrl">
                {{fileData.fileName}}
            </a>
        </v-card-title>
        <v-form v-model="isFormValid">
        <v-card-text>
        <FileMetadataEditor
            v-model="fileData"
            :coursesItems="coursesItems"
            :formDirHelper="formDirHelper"
            :headerNames="namesMap"
        >
        </FileMetadataEditor>
        </v-card-text>
        </v-form>
            <v-card-actions>
        <v-btn
            @click="_accept"
            color="primary"
            text
            outlined
        >
        <v-icon left>mdi-check</v-icon>
            אשר
        </v-btn>

        <v-btn
            @click="_remove"
            color="primary"
            text
        >
            מחק
        </v-btn>
        </v-card-actions>
        <iframe :src="iframeUrl" style="display:none;"/>
    </v-card>
    <v-snackbar
      v-model="showUndo"
    >
      {{snackbarText}}
        <v-btn
          color="primary"
          text
          @click="undo"
        >
          בטל
        </v-btn>
    </v-snackbar>
</div>
</template>

<script>
import FileMetadataEditor from './FileMetadataEditor'
import {FormDirHelper} from '../upload-form-helper'
import {GDRIVE_FILE_URL_PREFIX, ADMIN_APPS_SCRIPT_URL} from '../constants'
import { delay, getAppsScriptIframeUrl } from '../misc'

/**
 * Number of seconds to wait before removing/accepting file
 */
const UNDO_PERIOD_SECS = 2


export default {
  name: 'UploadApprovalCard',
  props: {
      coursesItems: Array,
      namesMap: Object,
      dbKey: String,
      fileData: Object,
      user: Object,
  },
  components: {
      FileMetadataEditor
  },
  data () {
    return {
        isFormValid: false,
        showComponent: true,
        undoAction: false,
        currentAction: '',
        showUndo: false,
        undoTimeout: UNDO_PERIOD_SECS,
        iframeUrl: ''
    }
  },

  computed: {
    formDirHelper(){
            return new FormDirHelper(this.fileData.courseId, this.fileData.directory, this.fileData)
    },
    fileUrl(){
        return `${GDRIVE_FILE_URL_PREFIX}${this.fileData.driveId}`
    },
    snackbarText(){
        if(this.currentAction == 'remove'){
            return 'הקובץ נמחק'
        }else if(this.currentAction == 'accept'){
            return 'הקובץ אושר'
        }
        return ''
    },
  },

  methods: {
      _remove(){
        this.currentAction = 'remove'
        this._delayAction(this.remove, UNDO_PERIOD_SECS)
      },
      _accept(){
        this.currentAction = 'accept'
        this._delayAction(this.accept, UNDO_PERIOD_SECS)
      },
      remove(){
          const that = this
          this.iframeUrl = getAppsScriptIframeUrl(
            ADMIN_APPS_SCRIPT_URL,
            this.fileData,
            {accept: false,
             key:that.dbKey,
             id:that.user ? that.user.uid : 'unauthorized'}
          )
          console.log(`Removing ${this.dbKey}: ${this.iframeUrl}`)
      },
      accept(){
          const that = this
          this.iframeUrl = getAppsScriptIframeUrl(
            ADMIN_APPS_SCRIPT_URL,
            this.fileData,
            {accept: true,
             key:that.dbKey,
             id:that.user ? that.user.uid : 'unauthorized'}
          )
          console.log(`Accepting ${this.dbKey}: ${this.iframeUrl}`)
      },
      _delayAction(action, delaySecs){
        this.showUndo = true
        this.showComponent = false
        const that = this
        delay(delaySecs).then(() => {
            if(that.undoAction){
                that.undoAction = false
            }else{
                action()
            }    
        })
      },
      undo(){
          this.showComponent = true
          this.showUndo = false

          this.undoAction = true
      }
  }
}

</script>
