<template>
    <v-dialog
      v-model="dialog"
      width="900px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          text
          v-bind="attrs"
          v-on="on"
          icon
        >
        <v-icon color="white">mdi-information</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title>איך משתמשים בדרייב</v-card-title>
        <v-tabs
          hide-slider
          v-model="tab"
        >
          <v-tab>
            חיפוש קבצים
          </v-tab>
          <v-tab>
            העלאת חומרים
          </v-tab>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <video autoplay muted loop width="830px" id="findFilesVideo">
                  <source v-if="dialog" src="../assets/tutorialVideo.mp4" type="video/mp4">
                  Your browser does not support the video tag.
                </video>        
              </v-card-text>
            </v-card>

          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <video autoplay muted loop width="830px" id="uploadFilesVideo">
                  <source v-if="dialog" src="../assets/uploadFileVideo.mp4" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
                <br>
                <v-divider></v-divider>
                <ul class="font-weight-bold" id="uploadInfoText">
                  <li>חשוב להוסיף שם מסכם או תיוגים אחרים כדי להבדיל משאר הקבצים מאותו הסוג</li>
                  <li>קבצים יופיעו באתר רק לאחר אישור אדמיניסטרטור</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
        <v-card-actions style="position:sticky;bottom:5px;">
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

  export default {
    name: 'TutorialDialog',
    props: {
        coursesItems : Array,
        headerNames : Object,
        defaultVisibillity: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            dialog: this.defaultVisibillity,
            videoIds: ["findFilesVideo", "uploadFilesVideo"],
            tab: 0,
        }
    },
    computed: {
        
    },
    methods: {
        replayVideo(videoId){
          let video = document.getElementById(videoId)
          if(video){
            video.pause()
            video.currentTime = 0
            video.play()
          }
        }
    },
    watch: {
      dialog: function(newDialogVal){
        if(newDialogVal){
          this.replayVideo(this.videoIds[this.tab])
        }
      },
      tab: function(newTab){
        let videoId = this.videoIds[newTab]
        this.replayVideo(videoId)
      }
    },
    created: function(){
    
    }
  }
</script>

<style scoped>
#uploadInfoText{
  padding-right: 15px;
  padding-left: 15px;
  font-size: medium;
}
</style>
