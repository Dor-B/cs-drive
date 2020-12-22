<template>
  <v-app>
    <!-- <meta name="theme-color" content="#Afffff"> -->
    <router-view :coursesItems="coursesItems" :namesMap="namesMap">
    </router-view>
  </v-app>
</template>

<script>
import { db } from "./db";
import { fbValue } from "./misc";

export default {
  name: "App",

  data() {
    return {
      coursesItems: []
    };
  },
  metaInfo() {
    return {
      title: "CS Drive",
      meta: [
        {
          vmid: "description",
          name: "description",
          content:
            "hello world, this is an example of adding a description with vueMeta"
          // icon: './graphics/pp.jpg'
        }
      ]
    };
  },

  computed: {},

  methods: {},

  created: function() {
    const that = this;
    db.ref("/courses")
      .once("value")
      .then(function(snapshot) {
        let coursesItems = [];
        snapshot.forEach(function(childSnapshot) {
          let name = childSnapshot
            .child("info")
            .child("name")
            .val();
          let id = childSnapshot.key;
          coursesItems.push({
            value: id,
            text: `${name} - ${id}`
          });
        });
        that.coursesItems = coursesItems;
      });
    // db.ref('/forApproval').push({
    //         'courseId':'104031',
    //         'directory': 'hw',
    //         'driveId': '1th1myHph72HdZ2GLGPr-t0Kb6Zn2dLQm',
    //         'semester': 'אביב',
    //         'number': '3',
    //         'fileName': ' 2 קובץ בדיקה'
    // })
  },
  asyncComputed: {
    namesMap: {
      get() {
        return fbValue("headers/namesMap");
      },
      default: {}
    }
  }
};
</script>
