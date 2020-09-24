<template>
    <div>
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
                :formInputHelper="formDirHelper"
                :header="header.value"
                :helperText="header.text"
        >
        </UploadInput>
    </div>
</template>

<script>
import {FormDirHelper} from '../upload-form-helper'
import UploadInput from './UploadInput'
import {fbValue, isNonEmptyStr, getFbCourseDirectories} from '../misc'


const EXCLUDED_HEADERS = new Set(['fileName'])

export default {
    name: 'FileMetadataEditor',
    components: {UploadInput},
    props: {
        values: Object,
        coursesItems : Array,
        headerNames : Object,
        formDirHelper: FormDirHelper
    },
    data(){
        return {
            courseId: '',
            directory: '',
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
    },
    watch: {
        value: function(val){
            this.outputData=val
        },
        outputData: function(val){
            this.$emit('input', val)
        },
        headers: function(newHeaders, oldHeaders){
            /// delete headers which no longer exist
            let leftBehind = Set.difference(
                new Set(oldHeaders.map(h => h.value)),
                new Set(newHeaders.map(h => h.value))
            )
            const that = this
            leftBehind.forEach(element => {
                delete that.headers[element]
            });
        },
        courseId: function(val){
            this.outputData.courseId = val
        },
        directory: function(val){
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
            return fbValue('headers/' + this.directory).then((headers) => headers.filter(h => !EXCLUDED_HEADERS.has(h.value)))
        },
        default: []
    }
    }
}
</script>