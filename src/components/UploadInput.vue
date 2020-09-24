<template>
    <v-autocomplete v-if="formDirHelper.isAutocomplete(header)"
                    v-model="output"
                    :items="formDirHelper.getAutocompleteList(header)"
                    :label="helperText"
                    light
                    required
    ></v-autocomplete>
    <v-text-field v-else
                    v-model="output"
                    :rules="formDirHelper.getRulesList(header)"
                    :label="helperText"
                    light
                    required
    >
    </v-text-field>
</template>

<script>
import {FormDirHelper} from '../upload-form-helper'

  export default {
    name: 'UploadInput',
    props: {
        formDirHelper : FormDirHelper,
        value: String,
        header : String,
        helperText: String
    },
    data() {
        return {
            output: ''
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
        this.output = this.value ? this.value : this.formDirHelper.getDefaultString(this.header)
        this.$emit('input', this.output)
    }
  }
</script>
