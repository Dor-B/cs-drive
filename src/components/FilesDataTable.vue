<template>
    <v-card flat>
        <v-card-title>
        {{title}}
      <v-spacer></v-spacer>
      <v-text-field
        v-if="!isMobile"
        v-model="search"
        append-icon="mdi-magnify"
        label="חפש"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
    v-if="!isMobile"
    v-model="selected"
    :headers="headers"
    :items="filteredItems"
    :search="search"
    :loading="loading"
    item-key="name"
    show-select
    class="elevation-1"
    >
    <template v-slot:body.prepend>
        <tr class="grey lighten-3">
        <td>
            <v-icon>mdi-filter-variant</v-icon>
        </td>
        <td
            v-for="(header, i) in headers"
            :key="header.text"
        >
            <template v-if="filterAble.hasOwnProperty(header.value)">
            <v-select
              style="max-width: 200px;"
              multiple clearable
              :items="columnValueList(header.value)"
              v-model="filters[header.value]"
              :menu-props="{ top: true, offsetY: true }"
            >   
            </v-select>
            </template>
            <template v-if="i == 0">
            <span class="subtitle-2">סנן:</span>
            </template>
        </td>
        </tr>
    </template>
    <template v-slot:item.fileName="data">
        <a target="_blank" rel="noopener noreferrer" :href="viewUrlFromId(data.item.driveId)">
            {{data.item.fileName}}
        </a>
    
    </template>

    </v-data-table>
    <div v-else> 
        <v-list-item two-line v-for="(item, i) in filteredMobileItems" :key="i">
            <v-list-item-content>
                <v-list-item-title>
                    <a target="_blank" rel="noopener noreferrer" :href="viewUrlFromId(item.driveId)">
                        {{item.fileName}}
                    </a>
                </v-list-item-title>
                <v-list-item-subtitle>{{displayMobileText(item)}}</v-list-item-subtitle>
        </v-list-item-content>
    </v-list-item>
    </div>
    </v-card>
</template>

<script>
import { DefaultDict, isListMatchingQuery } from '../misc.js'
import { GDRIVE_FILE_URL_PREFIX } from '../constants'


  export default {
    name: 'FilesDataTable',
    props: {
        headers: Array,
        items: Array,
        title: String,
        loading: Boolean
    },
    data() {
        return {
            selected : [],
            search: '',
            filters: {...(new DefaultDict(Array))}
        }
    },
    computed: {
        filteredItems() {
            return this.items.filter(d => {
                return Object.keys(this.filters).every(f => {
                    return this.filters[f].length < 1 || this.filters[f].includes(d[f])
                })
            })
        },
        filterAble(){
            return this.headers.filter((header) => header['filterType'] == 'multiple')
                        .reduce((ac,a) => ({...ac,[a.value]:''}),{})
        },
        isMobile(){
            return this.$vuetify.breakpoint.name == 'xs'
        },
        filteredMobileItems(){
            if(this.search == '') return this.items
            return this.items.filter(item => isListMatchingQuery(this.search, this.headerDataList(item)))
        }
    },
    methods: {
        columnValueList(val) {
            return this.items.map(d => d[val])
        },
        viewUrlFromId(id){
            return `${GDRIVE_FILE_URL_PREFIX}${id}`
        },
        headerDataList(item){
            return this.headers.map(h => h.value).filter(h => h in item).map(h => item[h])
        },
        displayMobileText(item){
            return this.headers.map(h => h.value).filter(h => h != 'fileName' && h in item).map(h => item[h])
            .join(', ')
        }
    }
  }
</script>
