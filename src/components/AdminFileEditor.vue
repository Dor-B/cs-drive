<template>
<v-expansion-panels accordion>
      <v-expansion-panel>
        <v-expansion-panel-header>מחיקה ועריכת קבצים קיימים</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-text-field
                v-model="driveLink"
                :rules="driveLinkRules"
                label="קישור לקובץ של גוגל דרייב"
                light
            >
            </v-text-field>
            <v-autocomplete
                v-model="currentCourseId"
                :items="coursesItems"
                label="בחר את הקורס המתאים לקובץ"
                light
            ></v-autocomplete> 
            <!-- {{fileMetadata}} -->
            <UploadApprovalCard v-if="fileInfo"
                :dbKey="fileInfo.key"
                :fileData="fileMetadata"
                :coursesItems="coursesItems"
                :namesMap="namesMap"
                :user="user"
                :appsScriptUrl="fileChangeAppsScriptUrl"
                :hideOnFinish="false"
                :disableRequired="true"
                :disableGuessing="true"
            ></UploadApprovalCard>
            <p v-else>קובץ לא נמצא בקורס \ הכנס מידע תקין</p>        
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
import UploadApprovalCard from './UploadApprovalCard'
// import {getAppsScriptIframeUrl} from '../misc'
import {ADMIN_CHANGE_FILE_APPS_SCRIPT_URL} from '../constants'
import { db } from '../db'


const driveLinkReg = /d\/(?<id>[^/]+)(?:\/|$)/g

export default {
    name: 'AdminFileEditor',
    components: {
        UploadApprovalCard
    },
    props: {
        coursesItems : Array,
        namesMap: Object,
        user: Object,
    },
    data() {
        return {
            isFileFound: false,
            // fileMetadata: {},
            currentCourseId: '',
            driveLink: '',
            driveLinkRules: [
                (v => !!v || 'אנא הכנס קישור לקובץ'),
                (v => ([...v.matchAll(driveLinkReg)].map(x => x.groups).length > 0) || 'הקישור איננו תקין')
            ],
            fileChangeAppsScriptUrl: ADMIN_CHANGE_FILE_APPS_SCRIPT_URL,
        }
    },
    computed: {
        driveIdToSearch(){
            const idMatches = [...this.driveLink.matchAll(driveLinkReg)].map(x => x.groups)
            if(idMatches.length > 0)
                return idMatches[0].id
            return null
        },
    },
    asyncComputed: {
        fileInfo: {
            get(){
                if(!this.currentCourseId || !this.driveIdToSearch)
                    return null
                const that = this
                return db.ref(`courses/${that.currentCourseId}/directories`).once('value')
                .then(snap => snap.val())
                .then(dirObj => {
                    for(const [dirname, dir] of Object.entries(dirObj)){
                        for(const [key, fileMetadata] of Object.entries(dir)){
                            if(fileMetadata.driveId == that.driveIdToSearch){
                                console.log(`key: ${key}, dir: ${dirname}`)
                                return {key, directory:dirname}
                            }
                        }
                    }
                    return null
                })
            },
            default: null
        },
        fileMetadata: {
            get(){
                if(!this.fileInfo) return {}
                const {key, directory} = this.fileInfo
                const that = this
                return db.ref(`courses/${this.currentCourseId}/directories/${directory}/${key}`).once('value')
                        .then(snap => snap.val())
                       .then(metadata => ({courseId:that.currentCourseId, driveId:that.driveIdToSearch, directory, ...metadata}))
            },
            default: {}
        }
    },
    methods: {

    },
    created: function(){

    }
}
</script>

