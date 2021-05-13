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
      <!-- {{filters}} -->
    </v-card-title>
    <v-data-table
    v-if="!isMobile"
    v-model="selected"
    :show-select="selectionMode"
    :headers="displayHeaders"
    :items="filteredItems"
    :loading="loading"
    :sort-by.sync="sortBy"
    disable-pagination
    hide-default-footer
    item-key="key"
    class="elevation-1"
    >
    <template v-slot:body.prepend v-if="nonEmptyHeaders.length > 1">
        <template v-if="!selectionMode">
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
                style="max-width: 120px;"
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
            <td>
                <v-icon :style="{opacity: emptyFilters ? '0' : '1'}" @click="removeFilters()">mdi-close</v-icon>
            </td> <!-- gray space for the more of this button -->
            </tr>
        </template>
        <template v-else>
            <tr>
                <td>
                    <v-btn icon color="primary" @click="selectionMode=false; selected=[]">
                        <v-icon>mdi-arrow-right</v-icon>
                    </v-btn>
                </td>
                <td :colspan="displayHeaders.length - 1">
                    {{selectionText}}
                </td>
                <td>
                    <v-btn color="primary" :disabled="selected.length==0" @click="downloadSelectedFiles()">
                        <v-icon left>mdi-download</v-icon>
                        הורד
                        ({{selected.length}})
                    </v-btn>
                </td>
            </tr>
        </template>
    </template>

    <template v-slot:item.icon="{ item }">
        <v-icon
        >
        {{fileIcon(item.mimeType)}}
        </v-icon>
    </template>
    <template v-slot:item.fileName="{ item }">
        <!-- <v-icon>mdi-check</v-icon> -->
        <a target="_blank" rel="noopener noreferrer" :href="viewUrlFromId(item.driveId)" :title="item.fileName">
            {{shortenFileName(item.fileName)}}
        </a>
    </template>
    <template v-slot:item.moreOfThisButton="{ item }">
        <v-menu
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              dark
              color="primary"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense>
              <v-list-item @click="selectionMode=true; addSelectedItem(item)">
                <v-list-item-icon><v-icon>mdi-select</v-icon></v-list-item-icon>
                <v-list-item-title>בחירה</v-list-item-title>
              </v-list-item>
              <v-list-item @click="downloadSingleFile(item.driveId)">
                <v-list-item-icon><v-icon>mdi-download</v-icon></v-list-item-icon>
                <v-list-item-title>הורד</v-list-item-title>
              </v-list-item>
              <!-- <v-list-item @click="null">
                <v-list-item-icon><v-icon>mdi-clipboard</v-icon></v-list-item-icon>
                <v-list-item-title>העתק קישור</v-list-item-title>
              </v-list-item> -->
          </v-list>
      </v-menu>  
      <v-tooltip bottom v-if="isMoreOfThisRelevant(item)">
        <template v-slot:activator="{ on, attrs }">
            <v-icon class="moreOfThisButton" @click="showMoreOfThis(item)"
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            >
                mdi-chevron-left
            </v-icon>
        </template>
        <span>{{moreOfThisHint(item)}}</span>
      </v-tooltip> 
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
import { isListMatchingQuery, sortWithNumbersCmp } from '../misc.js'
import { GDRIVE_FILE_URL_PREFIX } from '../constants'
import { downloadMultipleFilesOnBrowser, driveIdToDownloadURL } from '../downloader.js'

const MAX_FILENAME_CHARS = 40
const REVERSE_SORTED_FILTERS = ['year']

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
            search: '',
            filters: {},
            sortBy: 'fileName',
            selected: [],
            selectionMode: false,
        }
    },
    computed: {
        nonEmptyHeaders(){
            return this.headers.filter(h => this.items.some(item => h.value in item))
        },
        filteredItems() {
            const filterMatchesItem = ([filterName, filterList], item) => {
                if(filterList.length == 0)
                    return true
                if(this.isCommaSeparatedField(filterName)){
                    return filterList.every(filter => this.commaSeparatedToList(item[filterName]).includes(filter))
                }
                return filterList.includes(item[filterName])
            }
            let firstFiltered = this.items
            if(!this.isMobile){
                firstFiltered = firstFiltered.filter(item => {
                    return Object.entries(this.filters).every(filterPair => filterMatchesItem(filterPair, item))
                })
            }
            if(this.search == '') return firstFiltered
            return firstFiltered.filter(item => isListMatchingQuery(this.search, this.headerDataList(item)))
        },
        filterAble(){
            return this.headers.filter((header) => header['filterType'] == 'multiple')
                        .reduce((ac,a) => ({...ac,[a.value]:''}),{}) // to object
        },
        isMobile(){
            return this.$vuetify.breakpoint.name == 'xs'
        },
        displayHeaders(){
            if(this.selectionMode)
                return this.nonEmptyHeaders
            const optionalIconHeader = {value:'icon', width:'5px'}
            const moreOfThisHeader = {value: 'moreOfThisButton'}
            return [optionalIconHeader, ...this.nonEmptyHeaders, moreOfThisHeader]
        },
        emptyFilters(){
            if(Object.keys(this.filters).length == 0){
                return true
            }
            for(const val of Object.values(this.filters)){
                if(val.length > 0)
                    return false
            }
            return true
        },
        selectionText(){
            return `נבחרו ${this.selected.length} קבצים`
        }
    },
    watch: {
        headers: function(newHs){
            this.filters = {}
            this.setDefaultSort(newHs)
        },
    },
    created: function(){
        this.setDefaultSort(this.headers)
    },
    methods: {
        setDefaultSort(headers){
            if(headers.map(h=>h.value).includes('number')){
                this.sortBy = 'number'
            }else{
                this.sortBy = 'fileName'
            }
        },
        isCommaSeparatedField(fieldName){
            return ['comments'].includes(fieldName)
        },
        commaSeparatedToList(commaSeparatedText){
            if(!commaSeparatedText) return []
            return commaSeparatedText.split(',').map(comment => comment.trim())
        },
        columnValueList(field) {
            let fieldValues = this.items.filter(item => field in item).map(item => item[field])
            if(this.isCommaSeparatedField(field)){
                fieldValues = fieldValues
                .map(commaText => this.commaSeparatedToList(commaText)) // "a, b" --> ["a", "b"]
                .reduce((acc, newList) => [...acc, ...newList])
            }
            let sorted =  fieldValues.sort(sortWithNumbersCmp)
            if(REVERSE_SORTED_FILTERS.includes(field))
                sorted = sorted.reverse()
            return sorted
        },
        viewUrlFromId(id){
            return `${GDRIVE_FILE_URL_PREFIX}${id}`
        },
        headerDataList(item){
            return this.headers.map(h => h.value).filter(h => h in item).map(h => item[h])
        },
        displayMobileText(item){
            return this.headers.map(h => h.value).filter(h => h != 'fileName' && h in item)
            .map(h => {
                if(h == 'number') return `מס' ${item[h]}`
                return item[h]
            })
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
        },
        showMoreOfThis(item){
            let filters = {}
            let unfiltered = ['number', 'fileName']
            for(const {value} of this.nonEmptyHeaders){
                if(value in item && !unfiltered.includes(value) && item[value] != '')
                    filters[value] = [item[value]]
            }
            this.filters = filters
        },
        getItemMoreOfThisValues(item){
            let dont_show = ['number', 'fileName']
            let headers = this.nonEmptyHeaders.map(({value}) => value)
            return Object.entries(item)
                    .filter(([key,]) => headers.includes(key) && !dont_show.includes(key))
                    .map(([, value]) => value)
        },
        moreOfThisHint(item){
            let info = this.getItemMoreOfThisValues(item).join(' ')
            return "כל " + info
        },
        isMoreOfThisRelevant(item){
            return this.getItemMoreOfThisValues(item).length > 0
        },
        removeFilters(){
            this.filters = {}
        },
        addSelectedItem(item){
            if(this.selected.indexOf(item) === -1){
                this.selected.push(item)
            }
        },
        downloadFiles(driveIds){
            let downloadUrls = driveIds.map(driveIdToDownloadURL)
            downloadMultipleFilesOnBrowser(downloadUrls)
        },
        downloadSelectedFiles(){
            this.downloadFiles(this.selected.map(item => item.driveId))
        },
        downloadSingleFile(driveId){
            this.downloadFiles([driveId])
        }
    }
  }
</script>

<style scoped>
.moreOfThisButton{
    opacity: 0;
    transition: none;
}
tr:hover .moreOfThisButton{
    opacity: 1;
}
</style>