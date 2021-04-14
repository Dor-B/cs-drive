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
          icon
        >
        <v-icon color="white">mdi-information</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title>איך משתמשים בדרייב?</v-card-title>
        <v-card-text>
            בקרוב תיהיה פה תמונה
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
    },
    data() {
        return {
            dialog: false,
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
