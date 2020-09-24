<template>
    <v-autocomplete v-if="formInputHelper.isAutocomplete(header)"
                    v-model="output"
                    :items="formInputHelper.getAutocompleteList(header)"
                    :label="helperText"
                    light
                    required
    ></v-autocomplete>
    <v-text-field v-else
                    v-model="output"
                    :rules="formInputHelper.getRulesList(header)"
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
        value: String,
        header : String,
        helperText: String
    },
    data() {
        return {
            output: this.formInputHelper.getDefaultString(this.header)
        }
    },
    watch: {
        output: function(val){
            this.$emit('input', val)
        },
        value: function(val){
            this.output = val
        }
    },
    created: function(){
        this.$emit('input', this.output)
    }
  }
</script>
