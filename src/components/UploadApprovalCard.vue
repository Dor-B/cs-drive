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
            @click="accept"
            color="primary"
            text
            outlined
        >
        <v-icon left>mdi-check</v-icon>
            אשר
        </v-btn>

        <v-btn
            @click="remove"
            color="primary"
            text
        >
            מחק
        </v-btn>
        </v-card-actions>
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
import {GDRIVE_FILE_URL_PREFIX} from '../constants'
import { delay } from '../misc'

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
      fileData: Object
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
        undoTimeout: UNDO_PERIOD_SECS
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
      remove(){
        this.currentAction = 'remove'
        const that = this
        this._delayAction(() => {console.log(`Removing ${that.dbKey}`)}, UNDO_PERIOD_SECS)
      },
      accept(){
        this.currentAction = 'accept'
        const that = this
        this._delayAction(() => {console.log(`Accepting ${that.dbKey}`)}, UNDO_PERIOD_SECS)
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
