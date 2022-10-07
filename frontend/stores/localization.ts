import { stringifyKey } from "mobx/dist/internal";

type LocalizedText = Record<string, string>;
type Localization = Record<string, LocalizedText>;
type Months = Record<string, string[]>;
type Weekdays = Record<string, string[]>;

export interface Language {
    key: string;
    name: string;
}

export class Lang {

    private texts: Localization = {
        "en": {
            "en": "English",
            "main-title": "Customer contact manager",
            "main-logout": "Log out",
            "main-language": "Language",
            "menu-dashboard": "Dashboard",
            "menu-contacts": "Contact list",
            "button-add": "Add contact",
            "button-create": "Create",
            "button-save": "Save",
            "button-delete": "Delete",
            "button-cancel": "Cancel",
            "filter-email": "Filter by e-mail",
            "first-name": "First name",
            "last-name": "Last name",
            "email": "Email",
            "company": "Company",
            "status": "Status",
            "date": "Date",
            "contact": "Contact",
            "dashboard-contacts-company": "Contacts by company",
            "dashboard-contacts": "Contacts",
            "dashboard-yaxis": "Count",
            "success-save": "Contact saved.",
            "success-delete": "Contact deleted.",
            "error-offline": "Offline: Can't fetch new data.",
            "error-delete": "Failed to delete contact.",
            "error-save": "Contact save failed.",
            "dp-today": "Today",
            "dp-cancel": "Cancel",
            "dp-week": "Week",
            "dp-clear": "Clear",
            "dp-calendar": "Calendar"
        },
        "fi": {
            "fi": "Suomi",
            "main-title": "Asiakasyhteystietojen hallinta",
            "main-logout": "Poistu",
            "main-language": "Kieli",
            "menu-dashboard": "Tilastot",
            "menu-contacts": "Yhteystiedot",
            "button-add": "Lisää kontakti",
            "button-create": "Luo",
            "button-save": "Tallena",
            "button-delete": "Poista",
            "button-cancel": "Peruuta",
            "filter-email": "Hae sähköpostilla",
            "first-name": "Etunimi",
            "last-name": "Sukunimi",
            "email": "Sähköposti",
            "company": "Yritys",
            "status": "Tila",
            "date": "Päiväys",
            "contact": "Yhteystieto",
            "dashboard-contacts-company": "Yhteystiedot yrityksittäin",
            "dashboard-contacts": "Yhteystietoa",
            "dashboard-yaxis": "Määrä",
            "success-save": "Yhteystieto tallennettu.",
            "success-delete": "Yhteystieto poistettu.",
            "error-offline": "Ei yhteyttä: Tietojen päivitys ei onnistu.",
            "error-delete": "Yhteystiedon poisto ei onnistunut.",
            "error-save": "Yhteystiedon tallennus ei onnistunut.",
            "dp-today": "Tänään",
            "dp-cancel": "Peruuta",
            "dp-week": "Viikko",
            "dp-clear": "Tyhjennä",
            "dp-calendar": "Kalenteri"
        }
    };

    private monthNames: Months = {
        "en": [
            'January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September',
            'October', 'November', 'December'
        ],
        "fi": [
            'Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu',
            'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu',
            'Lokakuu', 'Marraskuu', 'Joulukuu'
        ]
    };

    private weekdays: Weekdays = {
        "en": [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'
        ],
        "fi": [
            'Sunnuntai', 'Maananta', 'Tiistai', 'Keskiviikko',
            'Torstai', 'Perjantai', 'Lauantai'
        ],
    };

    private weekdaysShort: Weekdays = {
        "en": [
            'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
        ],
        "fi": [
            'Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'
        ],
    };

    private languages : Language[] = [];

    constructor() {
        const langs : Language[] = [];
        for (const lang in this.texts) {
            const language : Language = { key:lang, name:this.texts[lang][lang] };
            langs.push(language);
        }
        this.languages = langs;
    }

    getLanguageName(lang: string) : string {
        if (this.texts[lang] && this.texts[lang][lang]) {
            return this.texts[lang][lang];
        } else {
            return "<no "+lang+">";
        }
    }

    getLanguage(key : string) : Language {
        for (var i=0;i<this.languages.length;i++) {
            if (this.languages[i].key === key) {
                return this.languages[i];
            }
        }
        return this.languages[0];
    }

    getLanguages() : Language[] {
        return this.languages;
    }

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

    getMonths(key : string) : string[] {
        return this.monthNames[key];
    }

    getWeekdays(key : string, short : boolean) : string[] {
        if (short) {
            return this.weekdaysShort[key];
        } else {
            return this.weekdays[key];
        }
    }

}

export const lang = new Lang();
