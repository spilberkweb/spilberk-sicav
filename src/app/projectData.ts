import { Language } from "./translations";

export const getProjectDesc = (projectKey: string, lang: Language): string => {
  const descriptions: Record<string, Record<Language, string>> = {
    v24: {
      cs: "Moderní nájemní bydlení v centru Brna, kolaudace 09/2025",
      en: "Modern rental housing in Brno city center, completion 09/2025",
      it: "Alloggi moderni in affitto nel centro di Brno, completamento 09/2025"
    },
    b45: {
      cs: "162 jednotek nájemního bydlení, plně pronajato od 2023",
      en: "162 rental housing units, fully rented since 2023",
      it: "162 unità di alloggi in affitto, completamente affittato dal 2023"
    },
    cejl: {
      cs: "3 bytové domy, dokončeno podzim 2024, 7 jednotek Airbnb",
      en: "3 apartment buildings, completed autumn 2024, 7 Airbnb units",
      it: "3 edifici residenziali, completati autunno 2024, 7 unità Airbnb"
    },
    b47: {
      cs: "Vysokoškolské koleje hotelového typu, 690 lůžek, SP 10/2025",
      en: "Hotel-type student dormitories, 690 beds, building permit 10/2025",
      it: "Dormitori studenteschi tipo hotel, 690 posti letto, permesso 10/2025"
    },
    kladno: {
      cs: "31 bytových domů, 5 etap, domov seniorů 85 míst, kolaudace 06/2032",
      en: "31 residential buildings, 5 phases, senior home 85 places, completion 06/2032",
      it: "31 edifici residenziali, 5 fasi, casa anziani 85 posti, completamento 06/2032"
    },
    platany: {
      cs: "4 bytové domy, 1+kk a 2+kk, 61 park. stání, SP 02/2025",
      en: "4 apartment buildings, 1+kk and 2+kk, 61 parking spaces, permit 02/2025",
      it: "4 edifici residenziali, 1+kk e 2+kk, 61 posti auto, permesso 02/2025"
    },
    vysk: {
      cs: "3 300 m² GLA, 100% obsazenost — Pro Spánek, Mountfield, Oresi",
      en: "3,300 m² GLA, 100% occupancy — Pro Spánek, Mountfield, Oresi",
      it: "3.300 m² GLA, 100% occupazione — Pro Spánek, Mountfield, Oresi"
    },
    lans: {
      cs: "2 500 m² GLA, 100% obsazenost — TETA, KIK, Datart, Dr. Max",
      en: "2,500 m² GLA, 100% occupancy — TETA, KIK, Datart, Dr. Max",
      it: "2.500 m² GLA, 100% occupazione — TETA, KIK, Datart, Dr. Max"
    },
    kyjov: {
      cs: "1 000 m² GLA, 100% obsazenost — Super zoo, TETA, Pepco",
      en: "1,000 m² GLA, 100% occupancy — Super zoo, TETA, Pepco",
      it: "1.000 m² GLA, 100% occupazione — Super zoo, TETA, Pepco"
    },
    ski: {
      cs: "Apartmánové domy s rekreačním zázemím, ve fázi přípravy",
      en: "Apartment buildings with recreational facilities, in preparation phase",
      it: "Edifici con appartamenti e strutture ricreative, in fase di preparazione"
    },
    chodov: {
      cs: "Ubytovací a rezidenční areál, aktuálně ve fázi přípravy",
      en: "Accommodation and residential complex, currently in preparation phase",
      it: "Complesso residenziale e ricettivo, attualmente in fase di preparazione"
    }
  };

  return descriptions[projectKey]?.[lang] || descriptions[projectKey]?.cs || "";
};

export const getTeamData = (lang: Language) => {
  const teamData = {
    cs: [
      { name: "Martin Pěnčík", role: "Zakladatel & Člen DR", desc: "Spoluzakladatel fondu, 50 % zakladatelských akcií. Operační řízení, development a stavebnictví. Zodpovědnost za projektový rozvoj." },
      { name: "Robert Sedláček", role: "Zakladatel & Předseda DR", desc: "Spoluzakladatel fondu, 50 % zakladatelských akcií. Advokát — právo nemovitostí, korporátní právo, právní architektura struktury." },
      { name: "Jan Hevessy", role: "CEO", desc: "15+ let v řízení investic a transformaci firem. Wharton School, Columbia Business School. Governance a profesionalizace fondových struktur." },
      { name: "Matěj Schánilec", role: "CFO", desc: "Finanční řízení fondu, reporting a compliance. Držitel kvalifikace ACCA. Strategické plánování kapitálu." },
      { name: "Šárka Tomanová", role: "HR & Office Manager", desc: "Řízení lidských zdrojů, kancelářský provoz a podpora interních procesů fondu." },
      { name: "Dominika Dočkalová", role: "Property Manager", desc: "Řízení divize správy nemovitostí. Správa domu, SVJ, koordinace pronájmů a facility management." },
      { name: "Martin Šimek", role: "Vedoucí retail segmentu", desc: "Správa a rozvoj portfolia komerčních nemovitostí a retail parků." },
    ],
    en: [
      { name: "Martin Pěnčík", role: "Founder & Board Member", desc: "Co-founder of the fund, 50% founder shares. Operations management, development and construction. Responsible for project development." },
      { name: "Robert Sedláček", role: "Founder & Board Chairman", desc: "Co-founder of the fund, 50% founder shares. Attorney — real estate law, corporate law, legal structure architecture." },
      { name: "Jan Hevessy", role: "CEO", desc: "15+ years in investment management and corporate transformation. Wharton School, Columbia Business School. Governance and professionalization of fund structures." },
      { name: "Matěj Schánilec", role: "CFO", desc: "Financial management of the fund, reporting and compliance. ACCA certified. Strategic capital planning." },
      { name: "Šárka Tomanová", role: "HR & Office Manager", desc: "Human resources management, office operations and support of internal fund processes." },
      { name: "Dominika Dočkalová", role: "Property Manager", desc: "Management of property management division. Building administration, HOA, rental coordination and facility management." },
      { name: "Martin Šimek", role: "Retail Segment Head", desc: "Management and development of commercial real estate and retail parks portfolio." },
    ],
    it: [
      { name: "Martin Pěnčík", role: "Fondatore & Membro CDA", desc: "Co-fondatore del fondo, 50% azioni fondatrici. Gestione operativa, sviluppo e costruzioni. Responsabile dello sviluppo progetti." },
      { name: "Robert Sedláček", role: "Fondatore & Presidente CDA", desc: "Co-fondatore del fondo, 50% azioni fondatrici. Avvocato — diritto immobiliare, diritto societario, architettura legale della struttura." },
      { name: "Jan Hevessy", role: "CEO", desc: "15+ anni nella gestione degli investimenti e trasformazione aziendale. Wharton School, Columbia Business School. Governance e professionalizzazione delle strutture di fondi." },
      { name: "Matěj Schánilec", role: "CFO", desc: "Gestione finanziaria del fondo, reporting e compliance. Certificato ACCA. Pianificazione strategica del capitale." },
      { name: "Šárka Tomanová", role: "HR & Office Manager", desc: "Gestione risorse umane, operazioni d'ufficio e supporto ai processi interni del fondo." },
      { name: "Dominika Dočkalová", role: "Property Manager", desc: "Gestione della divisione di amministrazione immobiliare. Amministrazione edifici, condominio, coordinamento affitti e facility management." },
      { name: "Martin Šimek", role: "Responsabile Segmento Retail", desc: "Gestione e sviluppo del portafoglio immobiliare commerciale e parchi retail." },
    ]
  };

  return teamData[lang];
};
