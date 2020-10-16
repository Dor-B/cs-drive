<template>
    <v-card flat>
        <v-card-title>
        {{title}}
      <v-spacer v-if="!isMobile"></v-spacer>
      <v-text-field
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
    :headers="headersWithIcon"
    :items="filteredItems"
    :loading="loading"
    disable-pagination
    hide-default-footer
    item-key="name"
    class="elevation-1"
    >
    <template v-slot:body.prepend>
        <tr class="grey lighten-3">
        <td>
            <v-icon>mdi-filter-variant</v-icon>
        </td>
        <td
            v-for="(header, i) in nonEmptyHeaders"
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
    <template v-slot:header.icon>
    </template>
    <template v-slot:item.icon="{ item }">
        <v-icon>{{fileIcon(item.mimeType)}}</v-icon>
    </template>
    <template v-slot:item.fileName="{ item }">
        <!-- <v-icon>mdi-check</v-icon> -->
        <a target="_blank" rel="noopener noreferrer" :href="viewUrlFromId(item.driveId)" :title="item.fileName">
            {{shortenFileName(item.fileName)}}
        </a>
    
    </template>

    </v-data-table>
    <div v-else> 
        <v-list-item two-line v-for="(item, i) in filteredItems" :key="i">
            <v-list-item-icon>
                <v-icon>{{fileIcon(item.mimeType)}}</v-icon>
            </v-list-item-icon>
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

const MAX_FILENAME_CHARS = 26

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
        nonEmptyHeaders(){
            return this.headers.filter(h => this.items.some(item => h.value in item))
        },
        filteredItems() {
            let firstFiltered = this.items
            if(!this.isMobile){
                firstFiltered = firstFiltered.filter(d => {
                    return Object.keys(this.filters).every(f => {
                        return this.filters[f].length < 1 || this.filters[f].includes(d[f])
                    })
                })
            }
            if(this.search == '') return firstFiltered
            return firstFiltered.filter(item => isListMatchingQuery(this.search, this.headerDataList(item)))
        },
        filterAble(){
            return this.headers.filter((header) => header['filterType'] == 'multiple')
                        .reduce((ac,a) => ({...ac,[a.value]:''}),{})
        },
        isMobile(){
            return this.$vuetify.breakpoint.name == 'xs'
        },
        headersWithIcon(){
            return [{value:'icon'}, ...this.nonEmptyHeaders]
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
        },
        fileIcon(mimeType){
            if(mimeType && mimeType.startsWith('image'))
                return 'mdi-image'
            const icons = {
                'application/pdf': 'mdi-pdf-box',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'mdi-file-word-box',
                'application/msword': 'mdi-file-word-box',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'mdi-file-excel-box',
                'application/vnd.ms-excel': 'mdi-file-excel-box',
                'application/vnd.ms-powerpoint': 'mdi-file-powerpoint-box',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'mdi-file-powerpoint-box',
                'text/plain': 'mdi-txt-box',
                'application/vnd.google-apps.spreadsheet': 'mdi-google-spreadsheet',
                'application/vnd.google-apps.document': 'mdi-file-document',
            }
            if(mimeType in icons)
                return icons[mimeType]
            return 'mdi-file'
        },
        shortenFileName(filename){
            const dots = '...'
            if(filename.length <= MAX_FILENAME_CHARS)
                return filename
            return filename.slice(0, MAX_FILENAME_CHARS - dots.length) + dots
        }
    }
  }
</script>