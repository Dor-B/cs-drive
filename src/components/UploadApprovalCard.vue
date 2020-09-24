<template>
<v-card>
    <v-card-title>
        <a target="_blank" rel="noopener noreferrer" :href="fileUrl">
            {{value.fileName}}
        </a>
    </v-card-title>
    <v-form v-model="isFormValid">
    <v-card-text>
        <v-autocomplete
                v-model="value.courseId"
                :items="coursesItems"
                label="קורס"
                light
                required
                :rules="courseRules"
        ></v-autocomplete>
        <v-autocomplete
                        v-model="value.directory"
                        :items="directories"
                        label="סוג החומר"
                        light
                        required
                        :rules="directoryRules"
        >
        </v-autocomplete>
        <UploadInput v-for="header in headers" :key="header"
                        v-model="value[header]"
                        :formInputHelper="formDirHelper.getInputHelper(header)"
                        :header="header"
                        :helperText="header"
        >
        </UploadInput>
    </v-card-text>
    </v-form>
    <!-- {{value}} -->
</v-card>
</template>

<script>
import UploadInput from './UploadInput'
import {FormDirHelper} from '../upload-form-helper'
import {getFbCourseDirectories} from '../misc'
import {GDRIVE_FILE_URL_PREFIX} from '../constants'

export default {
  name: 'UploadApprovalCard',
  props: {
      value: Object,
      coursesItems: Array
  },
  components: {
      UploadInput
  },
  data () {
    return {
        isFormValid: false,
        courseRules: [
            v => !!v || 'חובה לבחור קורס',
        ],
        directoryRules: [
            v => !!v || 'חובה לבחור סוג חומר',
        ],
    }
  },

  computed: {
    formDirHelper(){
            return new FormDirHelper(this.value.courseId, this.value.directory, this.value)
    },
    headers(){
          return Object.keys(this.value).filter(k => !['courseId','directory','driveId', 'fileName'].includes(k))
    },
    fileUrl(){
        return `${GDRIVE_FILE_URL_PREFIX}${this.value.driveId}`
    }
  },

  methods: {

  },
  asyncComputed: {
    directories: {
        get(){
            return getFbCourseDirectories(this.value.courseId)
        },
        default: []
    },
  },
  
  created : function(){

  } 
}

</script>

<style>
.v-text-field__details{
    display: none;
}
.v-card__title{
    padding-bottom: 0px;
}
</style>
