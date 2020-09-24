<template>
<v-card>
    <v-card-title>
        <a target="_blank" rel="noopener noreferrer" :href="fileUrl">
            {{tdata.fileName}}
        </a>
    </v-card-title>
    <v-form v-model="isFormValid">
    <v-card-text>
    <FileMetadataEditor
        v-model="tdata"
        :coursesItems="coursesItems"
        :formDirHelper="formDirHelper"
        :headerNames="namesMap"
    >
    </FileMetadataEditor>
    </v-card-text>
    </v-form>
        <v-card-actions>
      <v-btn
        color="primary"
        text
        outlined
      >
      <v-icon left>mdi-check</v-icon>
        אשר
      </v-btn>

      <v-btn
        color="primary"
        text
      >
        מחק
      </v-btn>
    </v-card-actions>
    <!-- {{value}} -->
</v-card>
</template>

<script>
import FileMetadataEditor from './FileMetadataEditor'
import {FormDirHelper} from '../upload-form-helper'
import {GDRIVE_FILE_URL_PREFIX} from '../constants'

export default {
  name: 'UploadApprovalCard',
  props: {
      coursesItems: Array,
      namesMap: Object
  },
  components: {
      FileMetadataEditor
  },
  data () {
    return {
        isFormValid: false,
        tdata: {
            'courseId':'234114',
            'directory': 'lectures',
            'driveId': '1th1myHph72HdZ2GLGPr-t0Kb6Zn2dLQm',
            'semester': 'אביב',
            'number': '3',
            'fileName': 'קובץ בדיקה'
        }
    }
  },

  computed: {
    formDirHelper(){
            return new FormDirHelper(this.tdata.courseId, this.tdata.directory, this.tdata)
    },
    fileUrl(){
        return `${GDRIVE_FILE_URL_PREFIX}${this.tdata.driveId}`
    }
  },

  
  created : function(){

  } 
}

</script>
