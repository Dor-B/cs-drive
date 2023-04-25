# cs-drive-app
This is the repo containing the frontend of the Technion CS Drive website loated at <https://technion-cs-drive.web.app/>.
Written with [VueJS 2](https://v2.vuejs.org/) as the web framework, and [Vuetify 2](https://v2.vuetifyjs.com/en/) as UI framwork for VueJS.
The app uses the Firebase Real-Time Database (`firebase` command). 
The packages are managed with [npm](https://www.npmjs.com/) to allow easy setup with `npm install`

See development documentation at <https://docs.google.com/document/d/12u0x8GUmIO3N6cXkhttc7OnrZ5leH7xaM0x6lI_2LnI/>. 


## Project setup
Download Node JS - <https://nodejs.org/en/download>, then open cmd and run here:
```
npm install
```

### Run locally on `localhost:8080/`
```
npm run serve
```

### Compile and Deploy
*! Remember to test the site before deploying* 
```
npm run build
firebase login  # first time login to technion.cs.drive@gmail.com
firebase deploy --only hosting
```
You can view and rollback to old deployed versions here: `https://console.firebase.google.com/project/technion-cs-drive/hosting/sites1`.

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Code structure
`src/`
* `App.vue` - main HTML
* `router/index.js` - determines routing (URL suffix) for client and admin views
* `Client.vue` - client view
* `admin.vue` - admin view
* `db.js` - firebase intialization
* `components/`
    * `FilesDataTable.vue` - the big main table of the client that shows all the files of the current course.
    * `UploadForm.vue` - main component for user upload.
    * `UploadApprovalCard.vue` - admin component for approving new files (at the bottom of the site)
    * `AdminFileEditor.vue`- admin component for editing existing files (at the top of the site)
        * `FileMetadataEditor.vue` - used by `UploadForm`, `AdminFileEditor` and `UploadApprovalCard` to edit a file's metadata
            *  `UploadInput.vue` - used by `FileMetadataEditor`
    * `TutorialDialog.vue` - explains the user how to use the website
* `plugin/vuetify.js` - theme
* `misc.js` - firebase utilities, local storage wrapper and more.
* `constants.js` - mainly URLs

### Data flow
First, in App.vue we:
- generate a mapping between every course id, to its representing name in Hebrew (e.g '234114': 'מדעי המחשב - 234114').
- get namesMap - a mapping between folder's variable name, to its Hebrew text (e.g 'hw': 'שיעורי בית').
Those 2 are passed to Client.vue, and Admin.vue with the router-view component into their props object. Client.vue and Admin.vue pass them forward with props as well.

Most components directly access firebase via the fbValue() function in misc.js.

### Server Side
Server side is accessed with iframe components that direct to Google Apps Script sites.
The URLs of the iframe are found in `constants.js` 
Further explanation is in the documentation above.


#### A note about async computed
Sometimes you see in vue file:
```
asyncComputed: {
    ...
}
This is an extention for VueJS to make JS Promises (builtin type for async objects, like database result)
easy to use with Vue's computed properties.
```


