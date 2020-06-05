<template>
    <v-card flat>
        <v-card-title>
        {{title}}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="חפש"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
    v-model="selected"
    :headers="headers"
    :items="filteredItems"
    :search="search"
    item-key="name"
    show-select
    class="elevation-1"
    >
    <template v-slot:body.prepend>
        <tr class="grey lighten-3">
        <td>
            <v-icon>filter_list</v-icon>
        </td>
        <td
            v-for="(header, i) in headers"
            :key="header.text"
        >
            <template v-if="filterAble.hasOwnProperty(header.value)">
            <v-select style="max-width: 200px;" multiple clearable :items="columnValueList(header.value)" v-model="filters[header.value]">
                
            </v-select>
            </template>
            <template v-if="i == 0">
            <span class="subtitle-2">סנן:</span>
            </template>
        </td>
        </tr>
    </template>

    </v-data-table>
    </v-card>
</template>

<script>
import { DefaultDict } from '../misc.js'
  export default {
    name: 'FilesDataTable',
    props: {
        headers: Array,
        items: Array,
        title: String
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
        }
    },
    methods: {
        columnValueList(val) {
            return this.items.map(d => d[val])
        }
    }
  }
</script>
