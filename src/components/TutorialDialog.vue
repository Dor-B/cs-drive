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
        <v-card-text>
          <video autoplay muted loop width="850px" :key="videoSrc">
            <source v-if="dialog" src="../assets/tutorialVideo.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>        
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
            videoURL: "../assets/tutorialVideo.mp4",
        }
    },
    computed: {
        
    },
    methods: {
        
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
    created: function(){
      // document.querySelector('#upload-iframe').onload = function(){
      //   console.log('loaded!', document.querySelector('#upload-iframe').contentDocument.dispatchEvent)
      // }
    }
  }
</script>
