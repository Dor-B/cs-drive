<template>
<v-app>
  <!-- <meta name="theme-color" content="#Afffff"> -->
  <router-view
    :coursesItems="coursesItems"
    :namesMap="namesMap"
  >
  </router-view>
</v-app>
</template>

<script>
import { db } from './db'
import { fbValue } from './misc'


export default {
  name: "App",

  data () {
    return {
      coursesItems: []
    }
  },
  metaInfo() {
    return {
      title: "CS Drive",
      meta: [
        {
          vmid: "description",
          name: "description",
          content: "hello world, this is an example of adding a description with vueMeta",
          // icon: './graphics/pp.jpg'
        }
      ]
    };
  },

  computed: {
    
  },

  methods: {
    
  },

  created: async function(){
    let ids = await db.ref('/coursesIds').once('value').then(snap => snap.val())
    ids = Object.values(ids)
    let coursesItems = []
    let namesGetters = []
    for(const id of ids){
      namesGetters.push(
        db.ref(`/courses/${id}/info/name`).once('value')
        .then(snap => snap.val())
        .then(name => {
          coursesItems.push({
            value: id,
            text:`${name} - ${id}`
          });
        })
      )
    }
    await Promise.all(namesGetters)
    this.coursesItems = coursesItems
  },
  asyncComputed: {
    namesMap:{
      get(){
        return fbValue('headers/namesMap')
      },
      default:{}
    },
  }
  
}

</script>
