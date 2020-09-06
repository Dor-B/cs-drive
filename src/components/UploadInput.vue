<template>
    <v-autocomplete v-if="formInputHelper.isAutocomplete"
                    v-model="output"
                    :items="formInputHelper.autocompleteList"
                    :label="helperText"
                    light
                    required
    ></v-autocomplete>
    <v-text-field v-else
                    v-model="output"
                    :rules="formInputHelper.rulesList"
                    :label="helperText"
                    light
                    required
    >
    </v-text-field>
</template>

<script>
import {FormInputHelper} from '../upload-form-helper'

  export default {
    name: 'UploadInput',
    props: {
        formInputHelper : FormInputHelper,
        header : String,
        helperText: String
    },
    data() {
        return {
            output: this.formInputHelper.defaultString 
        }
    },
    computed: {
        
    },
    methods: {

    },
    
  }
</script>
