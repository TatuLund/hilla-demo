import { DatePicker } from "@vaadin/date-picker";
import { LoginForm } from "@vaadin/login/vaadin-login-form";
import { setFormatter, updateI18n } from "./datepicker-util";

type LocalizedText = Record<string, string>;
type Localization = Record<string, LocalizedText>;
type Months = Record<string, string[]>;
type Weekdays = Record<string, string[]>;
type DateFormats = Record<string, string>;
type WeekStarts = Record<string, number>;

export interface Language {
    key: string;
    name: string;
}

export class Lang {

    private texts: Localization = {
        "us": {
            "us": "English",
            "main-title": "Customer contact manager",
            "main-logout": "Log out",
            "main-language": "Language",
            "main-zoom-toggle": "Switch size",
            "menu-dashboard": "Dashboard",
            "menu-contacts": "Contact list",
            "button-add": "Add contact",
            "button-create": "Create",
            "button-save": "Save",
            "button-delete": "Delete",
            "button-cancel": "Cancel",
            "button-confirm": "Confirm",
            "filter-email": "Filter by e-mail",
            "first-name": "First name",
            "last-name": "Last name",
            "email": "Email",
            "company": "Company",
            "status": "Status",
            "date": "Date",
            "prospect-value": "Prospected value",
            "contact": "Contact",
            "contact-confirm-delete": "Contact will permanently deleted",
            "dashboard-contacts-company": "Contacts by company",
            "dashboard-contacts": "Contacts",
            "dashboard-yaxis": "Count",
            "success-save": "Contact saved.",
            "success-delete": "Contact deleted.",
            "login-offline": "You are offline. Login is only available while online.",
            "error-offline": "Offline: Can't fetch new data.",
            "error-delete": "Failed to delete contact.",
            "error-save": "Contact save failed.",
            "dp-today": "Today",
            "dp-cancel": "Cancel",
            "dp-week": "Week",
            "dp-clear": "Clear",
            "dp-calendar": "Calendar",
            "offline": "Offline",
            "online": "Online",
            "validationError.PastOrPresentWeekdayAndRequired": "date is required, date can't be in future, date must be weekday",
            "validationError.NotEmpty": "input is required",
            "validationError.NotNull": "input is required",
            "validationError.Email": "input is not valid e-mail address",
            "validationError.PositiveOrZero": "value can't be negative",
            "login-title": "Log in",
            "login-username": "Username",
            "login-password": "Password",
            "login-submit": "Log in",
            "login-forgotPassword": "Forgot password",
            "login-error-title": "Incorrect username or password",
            "login-error-message": "Check that you have entered the correct username and password and try again.",
            "status-imported": "Imported lead",
            "status-notcontacted": "Not contacted", 
            "status-contacted": "Contacted",
            "status-customer": "Customer",
            "status-closed": "Closed (lost)",
            "currency-field-tooltip": "This is a currency field with automatic formatting"
        },
        "fi": {
            "fi": "Suomi",
            "main-title": "Asiakasyhteystietojen hallinta",
            "main-logout": "Poistu",
            "main-language": "Kieli",
            "main-zoom-toggle": "Vaihda kokoa",
            "menu-dashboard": "Tilastot",
            "menu-contacts": "Yhteystiedot",
            "button-add": "Lis???? kontakti",
            "button-create": "Luo",
            "button-save": "Tallena",
            "button-delete": "Poista",
            "button-cancel": "Peruuta",
            "button-confirm": "Vahvista",
            "filter-email": "Hae s??hk??postilla",
            "first-name": "Etunimi",
            "last-name": "Sukunimi",
            "email": "S??hk??posti",
            "company": "Yritys",
            "status": "Tila",
            "date": "P??iv??ys",
            "prospect-value": "Odotettu arvo",
            "contact": "Yhteystieto",
            "contact-confirm-delete": "Yhteystieto poistetaan pysyv??sti",
            "dashboard-contacts-company": "Yhteystiedot yrityksitt??in",
            "dashboard-contacts": "Yhteystietoa",
            "dashboard-yaxis": "M????r??",
            "success-save": "Yhteystieto tallennettu.",
            "success-delete": "Yhteystieto poistettu.",
            "error-offline": "Ei yhteytt??: Tietojen p??ivitys ei onnistu.",
            "login-offline": "Ei verkkoyhteytt??. Kirjautuminen ei ole mahdollista.",
            "error-delete": "Yhteystiedon poisto ei onnistunut.",
            "error-save": "Yhteystiedon tallennus ei onnistunut.",
            "dp-today": "T??n????n",
            "dp-cancel": "Peruuta",
            "dp-week": "Viikko",
            "dp-clear": "Tyhjenn??",
            "dp-calendar": "Kalenteri",
            "offline": "Ei verkkoyhteytt??",
            "online": "Verkossa",
            "validationError.PastOrPresentWeekdayAndRequired": "p??iv??m????r?? vaadittu, p??iv??m??m????r?? ei saa tulevaisuudessa, p??iv??m????r?? ei saa olla viikonloppuna",
            "validationError.NotEmpty": "sy??te ei saa olla tyhj??",
            "validationError.NotNull": "sy??te ei saa olla tyhj??",
            "validationError.Email": "sy??te ei ole kelvollinen s??hk??postiosoite",
            "validationError.PositiveOrZero": "arvo ei saa olla negatiivinen",
            "login-title": "Kirjautuminen",
            "login-username": "K??ytt??j??",
            "login-password": "Salasana",
            "login-submit": "Kirjaudu",
            "login-forgotPassword": "Salasana unohtunut",
            "login-error-title": "V????r?? k??ytt??j?? tai salasana",
            "login-error-message": "Tarkista, ett?? olet sy??tt??nyt k??ytt??j??n ja salasanan oikein.",
            "status-imported": "Ladattu kontakti",
            "status-notcontacted": "Ei kontaktoitu", 
            "status-contacted": "Kontaktoitu",
            "status-customer": "Asiakas",
            "status-closed": "Suljettu (menetetty)",
            "currency-field-tooltip": "T??m?? on automaattisesti formatoiva valuuttakentt??"
        }
    };

    private monthNames: Months = {
        "us": [
            'January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September',
            'October', 'November', 'December'
        ],
        "fi": [
            'Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu',
            'Kes??kuu', 'Hein??kuu', 'Elokuu', 'Syyskuu',
            'Lokakuu', 'Marraskuu', 'Joulukuu'
        ]
    };

    private weekdays: Weekdays = {
        "us": [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'
        ],
        "fi": [
            'Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko',
            'Torstai', 'Perjantai', 'Lauantai'
        ],
    };

    private weekdaysShort: Weekdays = {
        "us": [
            'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
        ],
        "fi": [
            'Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'
        ],
    };

    private weekStarts: WeekStarts = {
        "us": 0,
        "fi": 1,
    }

    private dateFormats: DateFormats = {
        "us": "MM-dd-yyyy",
        "fi": "dd.MM.yyyy"
    }

    private dateFormatsShort: DateFormats = {
        "us": "MM-dd-yy",
        "fi": "dd.MM.yy"
    }

    private languages : Language[] = [];

    constructor() {
        const langs : Language[] = [];
        for (const lang in this.texts) {
            const language : Language = { key:lang, name:this.texts[lang][lang] };
            langs.push(language);
        }
        this.languages = langs;
    }

    /**
     * Get the Language object corresponding give language string
     * 
     * @param lang The language as a string
     * @returns A Language object 
     */
    getLanguage(lang : string) : Language {
        for (var i=0;i<this.languages.length;i++) {
            if (this.languages[i].key === lang) {
                return this.languages[i];
            }
        }
        return this.languages[0];
    }

    /**
     * Get the list of languages found in the localization.
     * 
     * @returns Array of Language. 
     */
    getLanguages() : Language[] {
        return this.languages;
    }

    /**
     * Get the text of language if it is found. Otherwise returns "no lang:key".
     * 
     * @param lang Used language as string
     * @param key Key for the text
     * @returns A string value
     */
    getText(lang : string, key : string | undefined) : string {
        if (key) {
        if (this.texts[lang] && this.texts[lang][key]) {
            return this.texts[lang][key];
        } else {
            return "<no "+lang+":"+key+">";
        }
        } else {
            return "<no key>";
        }
    }

    /**
     * Return month names for the language.
     * 
     * @param lang The language as a string.
     * @returns Array of string
     */
    getMonths(lang : string) : string[] {
        return this.monthNames[lang];
    }

    /**
     * Return weekdays for the language.
     * 
     * @param lang The a language as a string.
     * @param short Return short formats if true, optional parameter
     * @returns 
     */
    getWeekdays(lang : string, short? : boolean) : string[] {
        if (short) {
            return this.weekdaysShort[lang];
        } else {
            return this.weekdays[lang];
        }
    }

    /**
     * Get index of the first day of the week by the language
     * 
     * @param lang The language as a string
     * @returns Number value, usually 0 or 1
     */
    getFirstDayOfWeek(lang : string) : number {
        return this.weekStarts[lang];
    }

    /**
     * Get the date format string by the language.
     * 
     * @param lang The language as a string. 
     * @param short Get the short date format if true, optional parameter
     * @returns A string value
     */
    getDateFormat(lang : string, short? : boolean) : string {
        if (short) {
            return this.dateFormatsShort[lang];
        } else {
            return this.dateFormats[lang];
        }
    }

    /**
     * Update the date picker formatter.
     * 
     * @param datePicker DatePicker from vaadin-date-picker
     */
    setDatePickerFormatter(datePicker : DatePicker) {
        setFormatter(datePicker);
    }

    /**
     * Populate existing i18n object of the DatePicker using the given language. 
     * 
     * @param datePicker DatePicker from vaadin-date-picker
     * @param lang The language using as string
     */
    updateDatePickerI18n(datePicker : DatePicker, lang : string) {
        updateI18n(datePicker, lang);
    }

    /**
     * Replace the i18n object of the LoginForm using the given language. 
     * 
     * @param loginForm LoginForm from vaadin-login-form
     * @param lang The language using as string
     */
    updateLoginFormI18n(loginForm : LoginForm, lang : string) {
        loginForm.i18n = {
            form: {
                title: this.getText(lang, "login-title"),
                username: this.getText(lang, "login-username"),
                password: this.getText(lang, "login-password"),
                submit: this.getText(lang, "login-submit"),
                forgotPassword: this.getText(lang, "login-forgotPassword")
            },
            errorMessage: {
                title: this.getText(lang, "login-error-title"),
                message: this.getText(lang, "login-error-message")
            }
        }
    }
}

export const lang = new Lang();
