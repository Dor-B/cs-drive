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
const startOfSpringNextYear = new Date(someYear+1, monthNames.indexOf('March'), 18)
const startOfSummer = new Date(someYear, monthNames.indexOf('August'), 1)


export class FormDirHelper{
    constructor(courseId, directory, outputData, guessDefault=true){
        this.courseId = courseId
        this.directory = directory
        this.outputData = outputData
        this.guessDefault = guessDefault
    }
    /**
     * Returns a default string which is a guess for the input
     */
    getDefaultString(inputHeader){
        if(!this.guessDefault)
            return ''
        const month = date.getMonth()
        const monthName = monthNames[month]
        const dayOfMonth = date.getDate()
        switch(inputHeader){
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
                if(now >= startOfWinter && now < startOfSpringNextYear)
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

    isAutocomplete(inputHeader){
        return ['semester', 'year'].includes(inputHeader)
    }

    getAutocompleteList(inputHeader){
        switch(inputHeader){
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

    getRulesList(inputHeader){
        const MAX_COMMENTS_LENGTH = 35
        if(inputHeader == 'number'){
            return [
                (num => (/^\d+$/.test(num) || 'הקלט אינו מספר חיובי')),
                (num => (parseInt(num) <= MAX_MATERIAL_NUMBER) || 'המספר שהוכנס גדול מדי')
            ]
        }
        if(inputHeader == 'comments'){
            return [
                (comment => comment.length <= MAX_COMMENTS_LENGTH || `הכנס עד ${MAX_COMMENTS_LENGTH} תווים`),
            ]
        }
        // default is no rule
        return []
    }

    getInputType(inputHeader){
        if(inputHeader == 'number')
            return 'number'
        return 'other'
    }
}