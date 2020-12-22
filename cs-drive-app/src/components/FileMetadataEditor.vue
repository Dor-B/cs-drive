<template>
  <div>
    <v-autocomplete
      v-model="outputData.courseId"
      :items="coursesItems"
      label="קורס*"
      light
      required
      :rules="courseRules"
    ></v-autocomplete>
    <v-autocomplete
      v-if="isCourseChosen"
      v-model="outputData.directory"
      :items="directories"
      label="סוג החומר*"
      light
      required
      :rules="directoryRules"
    >
    </v-autocomplete>
    <UploadInput
      v-for="header in headers"
      :key="header.value"
      v-model="outputData[header.value]"
      :formDirHelper="formDirHelper"
      :header="header.value"
      :helperText="header.text"
      :required="header.required && !disableRequired"
    >
    </UploadInput>
    <!-- {{outputData}} -->
  </div>
</template>

<script>
import { FormDirHelper } from "../upload-form-helper";
import UploadInput from "./UploadInput";
import { fbValue, isNonEmptyStr, getFbCourseDirectories } from "../misc";

const EXCLUDED_HEADERS = new Set(["fileName"]);

export default {
  name: "FileMetadataEditor",
  components: { UploadInput },
  props: {
    value: Object,
    coursesItems: Array,
    headerNames: Object,
    formDirHelper: FormDirHelper,
    disableRequired: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      outputData: {
        courseId: "",
        directory: ""
      },
      courseRules: [v => !!v || "חובה לבחור קורס"],
      directoryRules: [v => !!v || "חובה לבחור סוג חומר"]
    };
  },
  computed: {
    isCourseChosen() {
      return isNonEmptyStr(this.outputData.courseId);
    }
  },
  created() {
    this.outputData = this.value;
  },
  watch: {
    value: {
      handler: function(val) {
        this.outputData = val;
      },
      deep: true
    },
    headers: function(newHeaders, oldHeaders) {
      if (oldHeaders == null) return;
      /// delete headers which no longer exist
      let oldVals = oldHeaders.map(h => h.value);
      let newVals = newHeaders.map(h => h.value);
      let leftBehind = oldVals.filter(h => !newVals.includes(h));
      const that = this;
      leftBehind.forEach(element => {
        delete that.outputData[element];
      });
    },
    outputData: {
      handler: function(val) {
        this.$emit("input", val);
      },
      deep: true
    }
  },
  asyncComputed: {
    /**
     * A list of the directories and their names, e.g [{value:'lectures', text:'הרצאות'}, {...}, ...]
     * Used for the type of material autocomplete input
     */
    directories: {
      get() {
        const that = this;
        return getFbCourseDirectories(this.outputData.courseId).then(dirs =>
          dirs.map(dir => ({ value: dir, text: that.headerNames[dir] }))
        );
      },
      default: []
    },
    headers: {
      get() {
        if (!isNonEmptyStr(this.outputData.directory))
          return Promise.resolve([]);
        return fbValue("headers/" + this.outputData.directory).then(headers =>
          headers.filter(h => !EXCLUDED_HEADERS.has(h.value))
        );
      },
      default: []
    }
  }
};
</script>
