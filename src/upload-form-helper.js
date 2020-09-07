const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
let date = new Date()
const MIN_YEAR = 1970
const currentYear = date.getFullYear()
const MAX_MATERIAL_NUMBER = 50

const someYear = 1990
const startOfWinter = new Date(someYear, monthNames.indexOf('October'), 21)
const startOfSpring = new Date(someYear, monthNames.indexOf('March'), 18)
const startOfSummer = new Date(someYear, monthNames.indexOf('August'), 1)


export class FormDirHelper{
    constructor(courseId, directory, outputData){
        this.courseId = courseId
        this.directory = directory
        this.outputData = outputData
    }
    getInputHelper(inputHeader){
        return new FormInputHelper(this.courseId, this.directory, inputHeader, this.outputData)
    }
}

export class FormInputHelper{
    constructor(courseId, directory, inputHeader, allData){
        this.courseId = courseId
        this.directory = directory
        this.inputHeader = inputHeader
        this.allData = allData
    }
    /**
     * Returns a default string which is a guess for the input
     */
    get defaultString(){
        const month = date.getMonth()
        const monthName = monthNames[month]
        const dayOfMonth = date.getDate()
        switch(this.inputHeader){
            case 'year': {
                // return the year of current semester

                // check if its the beginning of the winter semester, than choose next year
                if(["November", "December"].includes(monthName) || (monthName == 'October' && (dayOfMonth > 20))){
                    return `${currentYear + 1}`
                }
                return `${currentYear}`
            }

            case 'semester': {
                // return current semester
                let now = new Date(someYear, month, dayOfMonth)
                if(now >= startOfWinter && now < startOfSpring)
                    return 'חורף'
                if(now >= startOfSpring && now < startOfSummer)
                    return 'אביב'
                return 'קיץ'
            }
                
            case 'number': {
                // TODO 
                return ''
            }
        }
        // default
        return ''
    }

    get isAutocomplete(){
        return ['semester', 'year'].includes(this.inputHeader)
    }

    get autocompleteList(){
        switch(this.inputHeader){
            case 'semester': {
                return ['קיץ', 'אביב', 'חורף']
            }
            case 'year': {
                let years = []
                for(let year = currentYear+1; year>=MIN_YEAR; year--)
                    years.push(`${year}`)
                return years
            }
        }
        // TODO: change null to [] in production.
        return null
    }

    get rulesList(){
        if(this.inputHeader == 'number'){
            return [
                (num => (/^\d+$/.test(num) || 'הקלט אינו מספר חיובי')),
                (num => (parseInt(num) <= MAX_MATERIAL_NUMBER) || 'המספר שהוכנס גדול מדי')
            ]
        }
        // default is no rule
        return []
    }

    get inputType(){
        if(this.inputHeader == 'number')
            return 'number'
        return 'other'
    }

}