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
    v-model="value"
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
            <template v-if="filters.hasOwnProperty(header.value)">
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
  export default {
    name: 'FilesDataTable',
    props: {
        headers: Array,
        items: Array,
        title: String
    },
    data() {
        return {
            search: '',
            filters:  this.headers.filter((header) => header['shouldFilter'] === true)
                        .reduce((ac,a) => ({...ac,[a.value]:[]}),{})
        }
    },
    computed: {
        filteredItems() {
            return this.items.filter(d => {
                return Object.keys(this.filters).every(f => {
                    return this.filters[f].length < 1 || this.filters[f].includes(d[f])
                })
            })
        }
    },
    methods: {
        columnValueList(val) {
            return this.items.map(d => d[val])
        }
    }
  }
</script>
