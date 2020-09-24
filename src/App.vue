<template>
<v-app>
  <router-view
    :coursesItems="coursesItems"
  >
  </router-view>
</v-app>
</template>

<script>
import { db } from './db'


export default {
  name: "App",

  data () {
    return {
      coursesItems: []
    }
  },

  computed: {
    
  },

  methods: {
    
  },

  created: function(){
    const that = this;
    db.ref('/courses').once('value').then(function(snapshot) {
        let coursesItems = [];
        snapshot.forEach(function(childSnapshot) {
          let name = childSnapshot.child('info').child('name').val()
          let id = childSnapshot.key
          coursesItems.push({
            value: id,
            text:`${name} - ${id}`
          });
        });
        that.coursesItems = coursesItems;
        console.log(that.coursesItems)
    });
  }
  
}

</script>
