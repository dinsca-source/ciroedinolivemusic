"use client";

import Image from "next/image";
import { type FormEvent, useEffect, useRef, useState } from "react";
import BackToTop from "@/components/BackToTop";
import GalleryLightbox from "@/components/GalleryLightbox";
import { MediaPlaybackProvider } from "@/components/MediaPlaybackContext";
import YouTubePlayer from "@/components/YouTubePlayer";
import SoundCloudPlayer from "@/components/SoundCloudPlayer";
import TracklistDialog from "@/components/TracklistDialog";

type LanguageCode = "it" | "en" | "fr" | "es" | "de" | "ru";
type EventType = "hotel" | "wedding" | "private_party" | "corporate" | "other";
type FormStatus = "idle" | "sending" | "success" | "error";

type ContactFormData = {
  fullName: string;
  email: string;
  eventType: EventType | "";
  eventDate: string;
  location: string;
  message: string;
  consent: boolean;
  website: string;
};

type Translation = {
  languageName: string;
  enterTitle: string;
  enterSubtitle: string;
  nav: {
    home: string;
    about: string;
    repertoire: string;
    gallery: string;
    video: string;
    audio: string;
    contacts: string;
  };
  hero: {
    eyebrow: string;
    subtitle: string;
    scroll: string;
  };
  about: {
    kicker: string;
    title: string;
    intro: string;
    paragraphOne: string;
    paragraphTwo: string;
    paragraphThree: string;
    pointExperience: string;
    pointRepertoire: string;
    pointTailored: string;
  };
  liveVenue: {
    kicker: string;
    title: string;
    paragraphOne: string;
    paragraphTwo: string;
    highlight: string;
    venueName: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    directions: string;
    directionsAriaLabel: string;
    venueContactsTitle: string;
    venueEmailLabel: string;
    venuePhoneLabel: string;
    artisticNotePrefix: string;
    artisticNoteLinkLabel: string;
    artisticNoteSuffix: string;
  };
  repertoire: {
    kicker: string;
    title: string;
    description: string;
    closing: string;
    categories: {
      italian: {
        title: string;
        description: string;
      };
      neapolitan: {
        title: string;
        description: string;
      };
      international: {
        title: string;
        description: string;
      };
      pop: {
        title: string;
        description: string;
      };
      rock: {
        title: string;
        description: string;
      };
      soul: {
        title: string;
        description: string;
      };
      dance: {
        title: string;
        description: string;
      };
      latin: {
        title: string;
        description: string;
      };
    };
  };
  gallery: {
    kicker: string;
    title: string;
    intro: string;
    contemporaryTitle: string;
    contemporaryText: string;
    historyKicker: string;
    historyTitle: string;
    historyText: string;
    historyCaptions: {
      firstYears: string;
      fredBongusto: string;
      povia: string;
    };
    historyItemAlts: {
      firstYears: string;
      fredBongusto: string;
      povia: string;
    };
    imageAlts: {
      hero: string;
      ciroPortrait: string;
      dinoPortrait: string;
      livePanorama: string;
      liveSunset: string;
      historyGuitar: string;
      historyPortrait: string;
      historyLive: string;
    };
    openImageAriaLabel: string;
    dialogLabel: string;
    closeLabel: string;
    previousLabel: string;
    nextLabel: string;
  };
  video: {
    kicker: string;
    title: string;
    description: string;
    youtubeCta: {
      title: string;
      text: string;
      button: string;
    };
    collections: {
      ymca: {
        title?: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      figliDelleStelle: {
        title?: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      staserachesera: {
        title?: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      rossettoECaffe: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      circoloForestieriShorts: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      somewhereOverTheRainbow: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      unforgettable: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      oiMari: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      stopBajon: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      stayingAlive: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      quandoQuando: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      perUnOraDAmore: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      thisMasquerade: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      quellaCarezzaDellaSera: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      ilCieloInUnaStanza: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      guardaCheLuna: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      georgiaOnMyMind: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      volare: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      ePensoATe: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      mamboItaliano: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
    };
    externalLinkText: string;
  };
  audio: {
    kicker: string;
    title: string;
    description: string;
    showAll: string;
    showLess: string;
    tracklistButton: string;
    tracklistHide: string;
    tracklistExport: string;
    tracklistHeading: string;
    tracklistClose: string;
    collections: {
      love: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      party: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
      timeless: {
        title: string;
        subtitle: string;
        iframeTitle: string;
        externalAriaLabel: string;
      };
    };
    externalLinkText: string;
  };
  contacts: {
    kicker: string;
    title: string;
    subtitle: string;
    description: string;
    fields: {
      fullName: string;
      email: string;
      eventType: string;
      eventDate: string;
      location: string;
      message: string;
      consent: string;
    };
    eventTypes: {
      hotel: string;
      wedding: string;
      private_party: string;
      corporate: string;
      other: string;
    };
    placeholders: {
      fullName: string;
      email: string;
      location: string;
      message: string;
    };
    submit: string;
    sending: string;
    success: string;
    error: string;
    validation: {
      fullName: string;
      email: string;
      eventType: string;
      message: string;
      consent: string;
    };
  };
  changeLanguage: string;
};

const languages: {
  code: LanguageCode;
  flag: string;
  label: string;
}[] = [
  { code: "it", flag: "/flags/it.svg", label: "Italiano" },
  { code: "en", flag: "/flags/en.svg", label: "English" },
  { code: "fr", flag: "/flags/fr.svg", label: "Français" },
  { code: "es", flag: "/flags/es.svg", label: "Español" },
  { code: "de", flag: "/flags/de.svg", label: "Deutsch" },
  { code: "ru", flag: "/flags/ru.svg", label: "Русский" },
];

const backToTopLabels: Record<LanguageCode, string> = {
  it: "Torna all'inizio",
  en: "Back to top",
  fr: "Retour en haut",
  es: "Volver arriba",
  de: "Nach oben",
  ru: "Наверх",
};

const eventTypeValues: EventType[] = [
  "hotel",
  "wedding",
  "private_party",
  "corporate",
  "other",
];

const initialContactFormData: ContactFormData = {
  fullName: "",
  email: "",
  eventType: "",
  eventDate: "",
  location: "",
  message: "",
  consent: false,
  website: "",
};

type VideoItemKey =
  | "circoloForestieriShorts"
  | "ymca"
  | "volare"
  | "somewhereOverTheRainbow"
  | "unforgettable"
  | "oiMari"
  | "quandoQuando"
  | "thisMasquerade";

type VideoOrientation = "landscape" | "portrait";

const videoItems: Array<{
  key: VideoItemKey;
  title: string;
  url: string;
  orientation: VideoOrientation;
}> = [
  {
    key: "circoloForestieriShorts",
    title: "Dino & Ciro ed il Circolo dei Forestieri",
    url: "https://youtube.com/shorts/QHTufT0ldyE?feature=share",
    orientation: "portrait",
  },
  {
    key: "ymca",
    title: "YMCA",
    url: "https://youtu.be/SoL-Ea-7saw",
    orientation: "landscape",
  },
  {
    key: "volare",
    title: "Volare",
    url: "https://youtube.com/shorts/OmFze9c3P5g?feature=share",
    orientation: "portrait",
  },
  {
    key: "somewhereOverTheRainbow",
    title: "Somewhere Over The Rainbow",
    url: "https://youtube.com/shorts/rkrZYHHd2h8?feature=share",
    orientation: "portrait",
  },
  {
    key: "unforgettable",
    title: "Unforgettable",
    url: "https://youtu.be/nS_tqpvlMIc",
    orientation: "landscape",
  },
  {
    key: "oiMari",
    title: "Oi Marì",
    url: "https://youtu.be/bq83alE8kDY",
    orientation: "landscape",
  },
  {
    key: "quandoQuando",
    title: "Quando Quando",
    url: "https://youtu.be/RZ5FNbS0vbI",
    orientation: "landscape",
  },
  {
    key: "thisMasquerade",
    title: "This Masquerade",
    url: "https://youtu.be/VyTWvpS4WZo",
    orientation: "landscape",
  },
];

const youtubeChannelUrl = "https://www.youtube.com/@CiroDinoLiveMusic";

function getYouTubeId(videoUrl: string): string | null {
  try {
    const parsedUrl = new URL(videoUrl);
    const normalizedHost = parsedUrl.hostname.replace(/^www\./, "");

    if (normalizedHost === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (
      normalizedHost === "youtube.com"
      || normalizedHost === "m.youtube.com"
      || normalizedHost === "youtube-nocookie.com"
    ) {
      if (parsedUrl.pathname.startsWith("/shorts/")) {
        return parsedUrl.pathname.split("/").filter(Boolean)[1] ?? null;
      }

      const searchVideoId = parsedUrl.searchParams.get("v");
      if (searchVideoId) {
        return searchVideoId;
      }

      const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
      if ((pathSegments[0] === "embed" || pathSegments[0] === "v") && pathSegments[1]) {
        return pathSegments[1];
      }
    }

    return null;
  } catch {
    return null;
  }
}

function getYouTubeEmbedUrl(videoUrl: string): string | null {
  const youtubeId = getYouTubeId(videoUrl);

  if (!youtubeId) {
    return null;
  }

  return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`;
}

const audioTracklists: Record<string, string[]> = {
  "timeless-classics-collection": [
    "Caruso",
    "Con te Partirò",
    "Adagio",
    "Nessun Dorma",
    "Torna A Surriento",
    "Hymne à l'amour",
    "L'ultima Notte",
    "My Way",
    "Ali Di Libertà",
    "Cinque giorni",
    "O Sole Mio",
    "The Prayer",
    "Good Love Gone Bad",
    "Il Mare Calmo Della Sera",
    "La forza della vita",
    "The Little Drummer Boy",
    "Be My Love",
  ],
  "party-collection": [
    "I Can Hear Your Heart Beat",
    "Viva la Vida",
    "Take Me Home, Country Roads",
    "Volare",
    "Sweet Caroline",
    "Papa Loves Mambo",
    "New York, New York",
    "That's Amore",
    "Proud Mary",
    "Lady (Hear Me Tonight)",
    "It's Not Unusual",
    "You",
    "I'm Your Boogie Man",
    "Bamboleo",
    "You're the First, the Last, My Everything",
    "Bailando",
    "Look Me in the Heart",
    "Baila Morena",
    "You See the Trouble with Me",
    "So Far Away",
    "Moonlight Lady",
    "Quiero Saber",
    "Loch Lomond",
    "Soul Food to Go",
  ],
  "love-collection": [
    "Perfect",
    "Io Amo",
    "Shape of My Heart",
    "Baby Can I Hold You",
    "A Song for You",
    "Ain't No Sunshine",
    "Historia de un Amor",
    "A Thousand Years",
    "Bellissima Bruttissima",
    "Abbracciame",
    "Che Cosa C'è",
    "Everything",
    "Balliamo",
    "How Deep Is Your Love",
    "Guarda che luna",
    "Anonimo Veneziano",
    "Amico che voli",
    "Ce la farò",
    "Mi Manchi",
    "Try a Little Tenderness",
    "Dio, come ti amo",
    "Ordinary",
    "E penso a te",
    "Maria Dolores",
    "Thinking Out Loud",
    "Me and Mrs. Jones",
    "Put Your Head on My Shoulder",
    "Sittin' on the Dock of the Bay",
    "Per sempre sì",
    "Facciamo pace",
    "This Masquerade",
    "Stretti",
    "Oggi sono io",
    "Ore d'amore",
    "Turn Out the Lamplight",
    "Sailing",
    "Rossetto e caffè",
    "La mia storia tra le dita",
    "Mal di te",
    "Senza 'e te",
    "Nun ce sta' piacere",
    "Solo tu",
  ],
};

const translations: Record<LanguageCode, Translation> = {
  it: {
    languageName: "Italiano",
    enterTitle: "Select your language",
    enterSubtitle: "Music that creates emotions",	
    nav: {
      home: "Home",
      about: "Chi siamo",
      audio: "Audio",
      repertoire: "Repertorio",
      gallery: "Gallery",
      video: "Video",
      contacts: "Contatti",
    },
    hero: {
      eyebrow: "Benvenuti nella nostra musica",
      subtitle: "Musica per momenti indimenticabili",
      scroll: "Scopri",
    },
    about: {
      kicker: "LA NOSTRA STORIA",
      title: "raccontata attraverso la musica",
      intro:
        "Ogni serata è un incontro. Ogni canzone racconta un'emozione.",
      paragraphOne:
        "Per noi la musica non è soltanto una professione: è il modo più autentico di comunicare, emozionare e creare ricordi destinati a durare nel tempo. Ciro & Dino Live Music nasce dall'incontro di due percorsi artistici accomunati dalla stessa passione: portare sul palco eleganza, qualità musicale e un rapporto sincero con il pubblico. Con tastiere, chitarra e voci diamo vita a spettacoli dal vivo capaci di adattarsi naturalmente all'atmosfera di ogni evento.",
      paragraphTwo:
        "Da circa trent'anni accompagniamo con continuità le serate dello storico Circolo dei Forestieri di Sorrento, esibendoci davanti a ospiti provenienti da ogni parte del mondo. Questa lunga esperienza ci ha insegnato che ogni pubblico è diverso e che ogni occasione richiede sensibilità, ascolto e la capacità di scegliere la musica giusta al momento giusto. Il nostro repertorio attraversa oltre sessant'anni di grandi successi: dalle più belle melodie italiane e napoletane agli standard internazionali, fino ai grandi classici pop, rock, soul, dance e latin che continuano ad emozionare generazioni diverse.",
      paragraphThree:
        "Che si tratti di una cena elegante, di un ricevimento, di una festa privata o di una serata dedicata al ballo, costruiamo ogni performance con un unico obiettivo: creare un'atmosfera coinvolgente, raffinata e capace di lasciare un ricordo speciale. Negli anni abbiamo imparato che il valore della musica dal vivo non si misura soltanto nella qualità dell'esecuzione, ma nella capacità di trasformare una semplice serata in un'esperienza da ricordare. È con questo spirito che saliamo sul palco, ogni volta.",
      pointExperience: "Oltre trent'anni di esperienza nella musica dal vivo.",
      pointRepertoire:
        "Repertorio italiano, napoletano e internazionale, costantemente aggiornato.",
      pointTailored:
        "Performance personalizzate per ricevimenti, eventi esclusivi e feste private.",
    },
    liveVenue: {
      kicker: "DOVE ASCOLTARCI DAL VIVO",
      title: "La nostra casa musicale a Sorrento",
      paragraphOne:
        "Da circa trent'anni, senza soluzione di continuità, Ciro & Dino accompagnano con la loro musica le serate del Circolo dei Forestieri – Terrazza delle Sirene, uno dei luoghi più suggestivi nel cuore di Sorrento.",
      paragraphTwo:
        "Nel corso degli anni, questa prestigiosa terrazza è diventata la nostra casa musicale: un luogo d'incontro tra eleganza, panorama e musica dal vivo, dove ogni esibizione nasce dal rapporto diretto con il pubblico.",
      highlight:
        "Circa trent'anni di musica dal vivo nella stessa prestigiosa sede.",
      venueName: "Circolo dei Forestieri – Terrazza delle Sirene",
      addressLine1: "Via Luigi de Maio, 35",
      addressLine2: "Sorrento",
      addressLine3: "Città Metropolitana di Napoli",
      addressLine4: "Italia",
      directions: "Indicazioni",
      directionsAriaLabel:
        "Apri le indicazioni per Circolo dei Forestieri – Terrazza delle Sirene su Google Maps (nuova scheda)",
      venueContactsTitle: "Contatti della struttura",
      venueEmailLabel: "Email struttura: info@circolodeiforestieri.com",
      venuePhoneLabel: "Telefono struttura: +39 081 877 3263",
      artisticNotePrefix:
        "Per informazioni artistiche, disponibilità ed eventi privati, utilizza il",
      artisticNoteLinkLabel: "modulo Contatti",
      artisticNoteSuffix: "di Ciro & Dino Live Music.",
    },
    repertoire: {
      kicker: "Il nostro repertorio",
      title: "Dalla tradizione al sound internazionale",
      description:
        "Musica italiana e napoletana, standard internazionali, pop, rock, soul, dance e Latin: ogni esibizione viene adattata all’atmosfera, al pubblico e all’occasione.",
      closing:
        "Ogni serata nasce dall'incontro con il pubblico. Per questo il nostro repertorio non è mai rigido: si adatta all'atmosfera, agli ospiti e al tipo di evento, alternando musica italiana e napoletana, standard internazionali, pop, rock, soul, dance e sonorità latin.",
      categories: {
        italian: {
          title: "Musica italiana",
          description: "Melodie senza tempo e grandi successi capaci di parlare a pubblici di generazioni diverse.",
        },
        neapolitan: {
          title: "Classici napoletani",
          description: "Brani della tradizione partenopea interpretati con eleganza, calore e immediatezza.",
        },
        international: {
          title: "Standard internazionali",
          description: "Un repertorio internazionale pensato per accompagnare con stile contesti raffinati e cosmopoliti.",
        },
        pop: {
          title: "Pop",
          description: "Canzoni riconoscibili e trasversali, ideali per creare un'atmosfera aperta e coinvolgente.",
        },
        rock: {
          title: "Rock",
          description: "Classici scelti con misura, energia e gusto, sempre in equilibrio con il momento della serata.",
        },
        soul: {
          title: "Soul",
          description: "Sonorità calde e raffinate che aggiungono profondità, ritmo e intensità emotiva.",
        },
        dance: {
          title: "Dance",
          description: "Brani dinamici selezionati per trasformare l'atmosfera quando la serata richiede più movimento.",
        },
        latin: {
          title: "Latin",
          description: "Colori e ritmi latin per dare fluidità, calore e varietà al percorso musicale della serata.",
        },
      },
    },
    gallery: {
      kicker: "MOMENTI DAL VIVO",
      title: "Momenti che raccontano la nostra musica",
      intro:
        "Ogni immagine custodisce l'atmosfera di una serata, l'incontro con il pubblico e l'emozione della musica dal vivo. Un percorso attraverso il presente e la storia di Ciro & Dino Live Music.",
      contemporaryTitle: "La musica, oggi",
      contemporaryText:
        "Tra strumenti, voci e panorami, ogni esibizione nasce dal rapporto diretto con il pubblico e dall'atmosfera unica di ogni serata.",
      historyKicker: "IL NOSTRO PERCORSO",
      historyTitle: "Oltre trent'anni di musica insieme",
      historyText:
        "Le fotografie cambiano, gli strumenti si evolvono, ma la passione resta la stessa. Un viaggio musicale iniziato oltre trent'anni fa e continuato senza interruzioni fino ad oggi.",
      historyCaptions: {
        firstYears: "Gli inizi del nostro viaggio musicale",
        fredBongusto: "Un incontro speciale con Fred Bongusto",
        povia: "Con Povia, condividendo la passione per la musica",
      },
      historyItemAlts: {
        firstYears: "Ciro e Dino durante una delle prime esibizioni del loro percorso musicale.",
        fredBongusto: "Ciro e Dino insieme a Fred Bongusto in una fotografia del loro percorso artistico.",
        povia: "Ciro e Dino insieme a Povia durante un incontro legato alla musica.",
      },
      imageAlts: {
        hero: "Ciro e Dino durante una performance musicale al tramonto.",
        ciroPortrait: "Ciro con la chitarra davanti al panorama costiero.",
        dinoPortrait: "Dino al pianoforte davanti al panorama costiero.",
        livePanorama: "Ciro e Dino durante un'esibizione dal vivo sulla terrazza.",
        liveSunset: "Ciro e Dino durante una performance al tramonto.",
        historyGuitar: "Ciro e Dino in una fotografia dei primi anni della loro attività.",
        historyPortrait: "Ciro e Dino insieme con la chitarra in una fotografia storica.",
        historyLive: "Ciro e Dino durante una delle loro prime esibizioni dal vivo.",
      },
      openImageAriaLabel: "Apri l'immagine in grande formato",
      dialogLabel: "Galleria fotografica di Ciro & Dino Live Music",
      closeLabel: "Chiudi galleria",
      previousLabel: "Immagine precedente",
      nextLabel: "Immagine successiva",
    },
    video: {
      kicker: "Live experience",
      title: "La nostra musica dal vivo",
      description:
        "Qui pubblicheremo una selezione di video per raccontare l’energia, l’eleganza e il coinvolgimento delle nostre esibizioni.",
      collections: {
        ymca: {
          subtitle: "Un brano energico e riconoscibile, perfetto per trasmettere slancio e partecipazione.",
          iframeTitle: "Video YouTube di YMCA",
          externalAriaLabel: "Guarda YMCA su YouTube in una nuova scheda",
        },
        figliDelleStelle: {
          subtitle: "Un classico elegante che unisce atmosfera e immediatezza.",
          iframeTitle: "Video YouTube di Figli delle Stelle",
          externalAriaLabel: "Guarda Figli delle Stelle su YouTube in una nuova scheda",
        },
        staserachesera: {
          subtitle: "Un grande brano italiano che porta ritmo e memoria condivisa.",
          iframeTitle: "Video YouTube di Stasera che sera",
          externalAriaLabel: "Guarda Stasera che sera su YouTube in una nuova scheda",
        },
        rossettoECaffe: {
          title: "Rossetto e Caffè",
          subtitle: "Rossetto e Caffè",
          iframeTitle: "Video YouTube di Rossetto e Caffè",
          externalAriaLabel: "Guarda Rossetto e Caffè su YouTube in una nuova scheda",
        },
        circoloForestieriShorts: {
          title: "Ciro & Dino al Circolo dei Forestieri",
          subtitle: "Ciro & Dino al Circolo dei Forestieri",
          iframeTitle: "Short YouTube di Ciro & Dino al Circolo dei Forestieri",
          externalAriaLabel: "Guarda Ciro & Dino al Circolo dei Forestieri su YouTube in una nuova scheda",
        },
        somewhereOverTheRainbow: {
          title: "Somewhere Over The Rainbow",
          subtitle: "Una melodia senza tempo, intima ed elegante.",
          iframeTitle: "Short YouTube di Somewhere Over The Rainbow",
          externalAriaLabel: "Guarda Somewhere Over The Rainbow su YouTube in una nuova scheda",
        },
        unforgettable: {
          title: "Unforgettable",
          subtitle: "Un classico raffinato, perfetto per atmosfere romantiche.",
          iframeTitle: "Video YouTube di Unforgettable",
          externalAriaLabel: "Guarda Unforgettable su YouTube in una nuova scheda",
        },
        oiMari: {
          title: "Oi Marì",
          subtitle: "Tradizione e calore mediterraneo in una versione coinvolgente.",
          iframeTitle: "Video YouTube di Oi Marì",
          externalAriaLabel: "Guarda Oi Marì su YouTube in una nuova scheda",
        },
        stopBajon: {
          title: "Stop Bajon",
          subtitle: "Ritmo e leggerezza per un momento di festa.",
          iframeTitle: "Video YouTube di Stop Bajon",
          externalAriaLabel: "Guarda Stop Bajon su YouTube in una nuova scheda",
        },
        stayingAlive: {
          title: "Staying Alive",
          subtitle: "Un'energia dance immediata che accende la serata.",
          iframeTitle: "Short YouTube di Staying Alive",
          externalAriaLabel: "Guarda Staying Alive su YouTube in una nuova scheda",
        },
        quandoQuando: {
          title: "Quando Quando",
          subtitle: "Quando Quando",
          iframeTitle: "Video YouTube di Quando Quando",
          externalAriaLabel: "Guarda Quando Quando su YouTube in una nuova scheda",
        },
        perUnOraDAmore: {
          title: "Per un'ora d'amore",
          subtitle: "Per un'ora d'amore",
          iframeTitle: "Video YouTube di Per un'ora d'amore",
          externalAriaLabel: "Guarda Per un'ora d'amore su YouTube in una nuova scheda",
        },
        thisMasquerade: {
          title: "This Masquerade",
          subtitle: "This Masquerade",
          iframeTitle: "Video YouTube di This Masquerade",
          externalAriaLabel: "Guarda This Masquerade su YouTube in una nuova scheda",
        },
        quellaCarezzaDellaSera: {
          title: "Quella carezza della sera",
          subtitle: "Quella carezza della sera",
          iframeTitle: "Video YouTube di Quella carezza della sera",
          externalAriaLabel: "Guarda Quella carezza della sera su YouTube in una nuova scheda",
        },
        ilCieloInUnaStanza: {
          title: "Il cielo in una stanza",
          subtitle: "Il cielo in una stanza",
          iframeTitle: "Short YouTube di Il cielo in una stanza",
          externalAriaLabel: "Guarda Il cielo in una stanza su YouTube in una nuova scheda",
        },
        guardaCheLuna: {
          title: "Guarda che luna",
          subtitle: "Guarda che luna",
          iframeTitle: "Short YouTube di Guarda che luna",
          externalAriaLabel: "Guarda che luna su YouTube in una nuova scheda",
        },
        georgiaOnMyMind: {
          title: "Georgia on my mind",
          subtitle: "Georgia on my mind",
          iframeTitle: "Short YouTube di Georgia on my mind",
          externalAriaLabel: "Guarda Georgia on my mind su YouTube in una nuova scheda",
        },
        volare: {
          title: "Volare",
          subtitle: "Volare",
          iframeTitle: "Short YouTube di Volare",
          externalAriaLabel: "Guarda Volare su YouTube in una nuova scheda",
        },
        ePensoATe: {
          title: "E penso a te",
          subtitle: "E penso a te",
          iframeTitle: "Video YouTube di E penso a te",
          externalAriaLabel: "Guarda E penso a te su YouTube in una nuova scheda",
        },
        mamboItaliano: {
          title: "Mambo Italiano",
          subtitle: "Mambo Italiano",
          iframeTitle: "Short YouTube di Mambo Italiano",
          externalAriaLabel: "Guarda Mambo Italiano su YouTube in una nuova scheda",
        },
      },
      externalLinkText: "Guarda su YouTube",
      youtubeCta: {
        title: "Scopri tutti i nostri video",
        text: "Sul nostro canale YouTube trovi molte altre performance dal vivo, nuovi video e aggiornamenti.",
        button: "Visita il nostro canale YouTube",
      },
    },
    audio: {
      kicker: "AUDIO",
      title: "Ascolta la nostra musica",
      description:
        "Tre raccolte pensate per raccontare le diverse anime del nostro repertorio: l’emozione, l’energia e i grandi classici senza tempo.",
      collections: {
        love: {
          title: "Love Collection",
          subtitle:
            "Una selezione di brani romantici e melodici, pensata per accompagnare i momenti più emozionanti.",
          iframeTitle: "Player SoundCloud per Love Collection",
          externalAriaLabel: "Ascolta Love Collection su SoundCloud in una nuova scheda",
        },
        party: {
          title: "Party Collection",
          subtitle:
            "Una raccolta di brani ritmati e coinvolgenti per feste, ricevimenti ed eventi pieni di energia.",
          iframeTitle: "Player SoundCloud per Party Collection",
          externalAriaLabel: "Ascolta Party Collection su SoundCloud in una nuova scheda",
        },
        timeless: {
          title: "Timeless Classics Collection",
          subtitle:
            "Grandi classici italiani e internazionali che continuano a emozionare generazione dopo generazione.",
          iframeTitle: "Player SoundCloud per Timeless Classics Collection",
          externalAriaLabel: "Ascolta Timeless Classics Collection su SoundCloud in una nuova scheda",
        },
      },
      externalLinkText: "Ascolta su SoundCloud",
      showAll: "Mostra tutti gli audio",
      showLess: "Mostra meno audio",
      tracklistButton: "Visualizza elenco brani del mix",
      tracklistHide: "Nascondi elenco brani",
      tracklistExport: "Esporta elenco brani",
      tracklistHeading: "Elenco brani",
      tracklistClose: "Chiudi",
    },
    contacts: {
      kicker: "Contatti",
      title: "Musica dal vivo per hotel, eventi e serate speciali",
      subtitle: "Parliamo del tuo evento",
      description:
        "Compila il modulo: ti risponderemo al più presto con una proposta su misura per la tua serata.",
      fields: {
        fullName: "Nome e cognome",
        email: "Email",
        eventType: "Tipo di evento",
        eventDate: "Data dell'evento",
        location: "Località",
        message: "Messaggio",
        consent: "Acconsento al trattamento dei dati personali per essere ricontattato.",
      },
      eventTypes: {
        hotel: "Hotel",
        wedding: "Matrimonio",
        private_party: "Festa privata",
        corporate: "Evento aziendale",
        other: "Altro",
      },
      placeholders: {
        fullName: "Es. Mario Rossi",
        email: "nome@esempio.com",
        location: "Es. Sorrento",
        message: "Raccontaci data, orari e atmosfera desiderata...",
      },
      submit: "Invia richiesta",
      sending: "Invio in corso",
      success: "Messaggio inviato con successo. Ti risponderemo al più presto.",
      error: "Si è verificato un errore durante l'invio. Riprova tra qualche minuto.",
      validation: {
        fullName: "Inserisci nome e cognome (almeno 2 caratteri).",
        email: "Inserisci un indirizzo email valido.",
        eventType: "Seleziona il tipo di evento.",
        message: "Inserisci un messaggio di almeno 10 caratteri.",
        consent: "Devi accettare il trattamento dei dati per inviare la richiesta.",
      },
    },
    changeLanguage: "Cambia lingua",
  },

  en: {
    languageName: "English",
    enterTitle: "Select your language",
    enterSubtitle: "Music that creates emotions",
    nav: {
      home: "Home",
      about: "About us",
      audio: "Audio",
      repertoire: "Repertoire",
      gallery: "Gallery",
      video: "Video",
      contacts: "Contacts",
    },
    hero: {
      eyebrow: "Welcome to our music",
      subtitle: "Music for unforgettable moments",
      scroll: "Discover",
    },
    about: {
      kicker: "OUR STORY",
      title: "told through music",
      intro:
        "Every evening is a meeting. Every song tells an emotion.",
      paragraphOne:
        "For us, music is not only a profession: it is the most authentic way to communicate, move people and create memories that last over time. Ciro & Dino Live Music was born from the encounter of two artistic paths united by the same passion: bringing elegance, musical quality and a genuine connection with the audience to the stage. With keyboards, guitar and vocals, we create live performances that naturally adapt to the atmosphere of each event.",
      paragraphTwo:
        "For around thirty years, we have regularly performed at the historic Circolo dei Forestieri in Sorrento, in front of guests from all over the world. This long experience has taught us that every audience is different and every occasion requires sensitivity, listening and the ability to choose the right music at the right moment. Our repertoire spans more than sixty years of great songs: from timeless Italian and Neapolitan melodies to international standards, as well as pop, rock, soul, dance and latin classics that continue to engage different generations.",
      paragraphThree:
        "Whether it is an elegant dinner, a reception, a private party or an evening dedicated to dancing, we build each performance with one clear goal: creating an engaging, refined atmosphere that leaves a special memory. Over the years, we have learned that the value of live music is measured not only by performance quality, but by the ability to turn a simple evening into an experience worth remembering. That is the spirit we bring to the stage, every time.",
      pointExperience: "Over thirty years of experience in live music.",
      pointRepertoire:
        "Italian, Neapolitan and international repertoire, constantly updated.",
      pointTailored:
        "Tailored performances for receptions, exclusive events and private parties.",
    },
    liveVenue: {
      kicker: "WHERE TO HEAR US LIVE",
      title: "Our musical home in Sorrento",
      paragraphOne:
        "For around thirty years, without interruption, Ciro & Dino have accompanied the evenings at Circolo dei Forestieri – Terrazza delle Sirene with live music, one of the most evocative venues in the heart of Sorrento.",
      paragraphTwo:
        "Over the years, this prestigious terrace has become our musical home: a meeting place of elegance, landscape and live performance, where each set grows from direct connection with the audience.",
      highlight:
        "Around thirty years of live music at the same prestigious venue.",
      venueName: "Circolo dei Forestieri – Terrazza delle Sirene",
      addressLine1: "Via Luigi de Maio, 35",
      addressLine2: "Sorrento",
      addressLine3: "Metropolitan City of Naples",
      addressLine4: "Italy",
      directions: "Directions",
      directionsAriaLabel:
        "Open directions to Circolo dei Forestieri – Terrazza delle Sirene on Google Maps (new tab)",
      venueContactsTitle: "Venue contacts",
      venueEmailLabel: "Venue email: info@circolodeiforestieri.com",
      venuePhoneLabel: "Venue phone: +39 081 877 3263",
      artisticNotePrefix:
        "For artistic enquiries, availability and private events, please use the",
      artisticNoteLinkLabel: "Contact form",
      artisticNoteSuffix: "of Ciro & Dino Live Music.",
    },
    repertoire: {
      kicker: "Our repertoire",
      title: "From tradition to international sound",
      description:
        "Italian and Neapolitan music, international standards, pop, rock, soul, dance and Latin: every performance is adapted to the atmosphere, the audience and the occasion.",
      closing:
        "Every evening begins with the audience. That is why our repertoire is never rigid: it adapts to the atmosphere, the guests and the nature of the event, moving naturally between Italian and Neapolitan music, international standards, pop, rock, soul, dance and latin sounds.",
      categories: {
        italian: {
          title: "Italian music",
          description: "Timeless melodies and beloved songs that connect naturally with different generations.",
        },
        neapolitan: {
          title: "Neapolitan classics",
          description: "Songs from the Neapolitan tradition performed with warmth, elegance and immediacy.",
        },
        international: {
          title: "International standards",
          description: "An international selection designed to accompany refined and cosmopolitan settings with style.",
        },
        pop: {
          title: "Pop",
          description: "Recognisable songs with broad appeal, ideal for creating an open and engaging atmosphere.",
        },
        rock: {
          title: "Rock",
          description: "Carefully chosen classics that bring energy and character while respecting the mood of the evening.",
        },
        soul: {
          title: "Soul",
          description: "Warm, refined sounds that add depth, groove and emotional intensity.",
        },
        dance: {
          title: "Dance",
          description: "Dynamic tracks selected to lift the energy when the event calls for more movement.",
        },
        latin: {
          title: "Latin",
          description: "Latin colours and rhythms that bring warmth, flow and variety to the musical experience.",
        },
      },
    },
    gallery: {
      kicker: "LIVE MOMENTS",
      title: "Moments that tell our music story",
      intro:
        "Each image holds the atmosphere of an evening, the encounter with the audience and the emotion of live music. A visual journey through the present and the history of Ciro & Dino Live Music.",
      contemporaryTitle: "The music, today",
      contemporaryText:
        "Between instruments, voices and breathtaking views, every performance is shaped by a direct connection with the audience and by the unique mood of each evening.",
      historyKicker: "OUR JOURNEY",
      historyTitle: "More than thirty years of music together",
      historyText:
        "Photographs change and instruments evolve, but the passion remains the same. A musical journey that began over thirty years ago and has continued without interruption to this day.",
      historyCaptions: {
        firstYears: "The early years of our musical journey",
        fredBongusto: "A special encounter with Fred Bongusto",
        povia: "With Povia, sharing a passion for music",
      },
      historyItemAlts: {
        firstYears: "Ciro and Dino during one of the earliest performances in their musical journey.",
        fredBongusto: "Ciro and Dino with Fred Bongusto in a photograph from their artistic journey.",
        povia: "Ciro and Dino with Povia during a music-related encounter.",
      },
      imageAlts: {
        hero: "Ciro and Dino during a sunset live performance.",
        ciroPortrait: "Ciro with guitar in front of the coastal panorama.",
        dinoPortrait: "Dino at the piano in front of the coastal panorama.",
        livePanorama: "Ciro and Dino during a live performance on the terrace.",
        liveSunset: "Ciro and Dino during a sunset performance.",
        historyGuitar: "Ciro and Dino in a photograph from the early years of their activity.",
        historyPortrait: "Ciro and Dino together with guitar in a historical photograph.",
        historyLive: "Ciro and Dino during one of their earliest live performances.",
      },
      openImageAriaLabel: "Open image in full size",
      dialogLabel: "Ciro & Dino Live Music photo gallery",
      closeLabel: "Close gallery",
      previousLabel: "Previous image",
      nextLabel: "Next image",
    },
    video: {
      kicker: "Live experience",
      title: "Our live music",
      description:
        "Here we will publish a selection of videos showing the energy, elegance and audience engagement of our performances.",
      collections: {
        ymca: {
          subtitle: "An energetic and instantly recognisable track, perfect for bringing momentum and audience connection.",
          iframeTitle: "YouTube video of YMCA",
          externalAriaLabel: "Watch YMCA on YouTube in a new tab",
        },
        figliDelleStelle: {
          subtitle: "An elegant classic that combines atmosphere and immediacy.",
          iframeTitle: "YouTube video of Figli delle Stelle",
          externalAriaLabel: "Watch Figli delle Stelle on YouTube in a new tab",
        },
        staserachesera: {
          subtitle: "A great Italian song that brings rhythm and shared memory.",
          iframeTitle: "YouTube video of Stasera che sera",
          externalAriaLabel: "Watch Stasera che sera on YouTube in a new tab",
        },
        rossettoECaffe: {
          title: "Rossetto and Coffee",
          subtitle: "Rossetto and Coffee",
          iframeTitle: "YouTube video of Rossetto and Coffee",
          externalAriaLabel: "Watch Rossetto and Coffee on YouTube in a new tab",
        },
        circoloForestieriShorts: {
          title: "Ciro & Dino at the Circolo dei Forestieri",
          subtitle: "Ciro & Dino at the Circolo dei Forestieri",
          iframeTitle: "YouTube Short of Ciro & Dino at the Circolo dei Forestieri",
          externalAriaLabel: "Watch Ciro & Dino at the Circolo dei Forestieri on YouTube in a new tab",
        },
        somewhereOverTheRainbow: {
          title: "Somewhere Over The Rainbow",
          subtitle: "A timeless melody with an intimate, elegant mood.",
          iframeTitle: "YouTube Short of Somewhere Over The Rainbow",
          externalAriaLabel: "Watch Somewhere Over The Rainbow on YouTube in a new tab",
        },
        unforgettable: {
          title: "Unforgettable",
          subtitle: "A refined classic, ideal for romantic atmospheres.",
          iframeTitle: "YouTube video of Unforgettable",
          externalAriaLabel: "Watch Unforgettable on YouTube in a new tab",
        },
        oiMari: {
          title: "Oi Marì",
          subtitle: "Mediterranean warmth and tradition in an engaging performance.",
          iframeTitle: "YouTube video of Oi Marì",
          externalAriaLabel: "Watch Oi Marì on YouTube in a new tab",
        },
        stopBajon: {
          title: "Stop Bajon",
          subtitle: "Rhythm and lightness for a joyful party moment.",
          iframeTitle: "YouTube video of Stop Bajon",
          externalAriaLabel: "Watch Stop Bajon on YouTube in a new tab",
        },
        stayingAlive: {
          title: "Staying Alive",
          subtitle: "Instant dance energy to lift the evening.",
          iframeTitle: "YouTube Short of Staying Alive",
          externalAriaLabel: "Watch Staying Alive on YouTube in a new tab",
        },
        quandoQuando: {
          title: "Quando Quando",
          subtitle: "Quando Quando",
          iframeTitle: "YouTube video of Quando Quando",
          externalAriaLabel: "Watch Quando Quando on YouTube in a new tab",
        },
        perUnOraDAmore: {
          title: "Per un'ora d'amore",
          subtitle: "Per un'ora d'amore",
          iframeTitle: "YouTube video of Per un'ora d'amore",
          externalAriaLabel: "Watch Per un'ora d'amore on YouTube in a new tab",
        },
        thisMasquerade: {
          title: "This Masquerade",
          subtitle: "This Masquerade",
          iframeTitle: "YouTube video of This Masquerade",
          externalAriaLabel: "Watch This Masquerade on YouTube in a new tab",
        },
        quellaCarezzaDellaSera: {
          title: "Quella carezza della sera",
          subtitle: "Quella carezza della sera",
          iframeTitle: "YouTube video of Quella carezza della sera",
          externalAriaLabel: "Watch Quella carezza della sera on YouTube in a new tab",
        },
        ilCieloInUnaStanza: {
          title: "Il cielo in una stanza",
          subtitle: "Il cielo in una stanza",
          iframeTitle: "YouTube Short of Il cielo in una stanza",
          externalAriaLabel: "Watch Il cielo in una stanza on YouTube in a new tab",
        },
        guardaCheLuna: {
          title: "Guarda che luna",
          subtitle: "Guarda che luna",
          iframeTitle: "YouTube Short of Guarda che luna",
          externalAriaLabel: "Watch Guarda che luna on YouTube in a new tab",
        },
        georgiaOnMyMind: {
          title: "Georgia on my mind",
          subtitle: "Georgia on my mind",
          iframeTitle: "YouTube Short of Georgia on my mind",
          externalAriaLabel: "Watch Georgia on my mind on YouTube in a new tab",
        },
        volare: {
          title: "Volare",
          subtitle: "Volare",
          iframeTitle: "YouTube Short of Volare",
          externalAriaLabel: "Watch Volare on YouTube in a new tab",
        },
        ePensoATe: {
          title: "E penso a te",
          subtitle: "E penso a te",
          iframeTitle: "YouTube video of E penso a te",
          externalAriaLabel: "Watch E penso a te on YouTube in a new tab",
        },
        mamboItaliano: {
          title: "Mambo Italiano",
          subtitle: "Mambo Italiano",
          iframeTitle: "YouTube Short of Mambo Italiano",
          externalAriaLabel: "Watch Mambo Italiano on YouTube in a new tab",
        },
      },
      externalLinkText: "Watch on YouTube",
      youtubeCta: {
        title: "Discover all our videos",
        text: "Visit our YouTube channel to watch many more live performances, new videos and updates.",
        button: "Visit our YouTube channel",
      },
    },
    audio: {
      kicker: "AUDIO",
      title: "Listen to our music",
      description:
        "Three collections designed to reflect the different sides of our repertoire: emotion, energy and timeless classics.",
      collections: {
        love: {
          title: "Love Collection",
          subtitle:
            "A selection of romantic and melodic songs, designed to accompany the most emotional moments.",
          iframeTitle: "SoundCloud player for Love Collection",
          externalAriaLabel: "Listen to Love Collection on SoundCloud in a new tab",
        },
        party: {
          title: "Party Collection",
          subtitle:
            "A collection of lively, rhythmic tracks for parties, receptions and high-energy events.",
          iframeTitle: "SoundCloud player for Party Collection",
          externalAriaLabel: "Listen to Party Collection on SoundCloud in a new tab",
        },
        timeless: {
          title: "Timeless Classics Collection",
          subtitle:
            "Great Italian and international classics that continue to move audiences across generations.",
          iframeTitle: "SoundCloud player for Timeless Classics Collection",
          externalAriaLabel: "Listen to Timeless Classics Collection on SoundCloud in a new tab",
        },
      },
      externalLinkText: "Listen on SoundCloud",
      showAll: "Show all audio",
      showLess: "Show less audio",
      tracklistButton: "View mix tracklist",
      tracklistHide: "Hide tracklist",
      tracklistExport: "Export tracklist",
      tracklistHeading: "Tracklist",
      tracklistClose: "Close",
    },
    contacts: {
      kicker: "Contacts",
      title: "Live music for hotels, events and special evenings",
      subtitle: "Let's talk about your event",
      description:
        "Fill out the form and we will get back to you soon with a tailored proposal.",
      fields: {
        fullName: "Full name",
        email: "Email",
        eventType: "Event type",
        eventDate: "Event date",
        location: "Location",
        message: "Message",
        consent: "I agree to the processing of my personal data to be contacted.",
      },
      eventTypes: {
        hotel: "Hotel",
        wedding: "Wedding",
        private_party: "Private party",
        corporate: "Corporate event",
        other: "Other",
      },
      placeholders: {
        fullName: "e.g. John Smith",
        email: "name@example.com",
        location: "e.g. London",
        message: "Tell us your date, timing and preferred atmosphere...",
      },
      submit: "Send request",
      sending: "Sending...",
      success: "Message sent successfully. We will get back to you soon.",
      error: "An error occurred while sending your message. Please try again shortly.",
      validation: {
        fullName: "Enter your full name (at least 2 characters).",
        email: "Enter a valid email address.",
        eventType: "Select an event type.",
        message: "Enter a message with at least 10 characters.",
        consent: "You must accept data processing to send your request.",
      },
    },
    changeLanguage: "Change language",
  },

  fr: {
    languageName: "Français",
    enterTitle: "Select your language",
    enterSubtitle: "Music that creates emotions",    
	nav: {
      home: "Accueil",
      about: "À propos",
      audio: "Audio",
      repertoire: "Répertoire",
      gallery: "Galerie",
      video: "Vidéo",
      contacts: "Contacts",
    },
    hero: {
      eyebrow: "Bienvenue dans notre musique",
      subtitle: "La musique pour des moments inoubliables",
      scroll: "Découvrir",
    },
    about: {
      kicker: "NOTRE HISTOIRE",
      title: "racontée à travers la musique",
      intro:
        "Chaque soirée est une rencontre. Chaque chanson raconte une émotion.",
      paragraphOne:
        "Pour nous, la musique n'est pas seulement un métier: c'est la manière la plus authentique de communiquer, d'émouvoir et de créer des souvenirs durables. Ciro & Dino Live Music est né de la rencontre de deux parcours artistiques unis par la même passion: apporter sur scène élégance, qualité musicale et relation sincère avec le public. Avec claviers, guitare et voix, nous donnons vie à des performances live capables de s'adapter naturellement à l'atmosphère de chaque événement.",
      paragraphTwo:
        "Depuis près de trente ans, nous accompagnons avec régularité les soirées du Circolo dei Forestieri de Sorrente, devant des invités venus du monde entier. Cette longue expérience nous a appris que chaque public est différent et que chaque occasion demande sensibilité, écoute et capacité à choisir la bonne musique au bon moment. Notre répertoire traverse plus de soixante ans de grands succès: des plus belles mélodies italiennes et napolitaines aux standards internationaux, jusqu'aux grands classiques pop, rock, soul, dance et latin qui continuent d'émouvoir des générations différentes.",
      paragraphThree:
        "Qu'il s'agisse d'un dîner élégant, d'une réception, d'une fête privée ou d'une soirée dansante, nous concevons chaque prestation avec un objectif unique: créer une atmosphère raffinée, engageante et capable de laisser un souvenir particulier. Au fil des années, nous avons appris que la valeur de la musique live ne se mesure pas seulement à la qualité d'exécution, mais à la capacité de transformer une simple soirée en une expérience mémorable. C'est avec cet esprit que nous montons sur scène, à chaque fois.",
      pointExperience: "Plus de trente ans d'expérience dans la musique live.",
      pointRepertoire:
        "Répertoire italien, napolitain et international, constamment mis à jour.",
      pointTailored:
        "Performances personnalisées pour réceptions, événements exclusifs et fêtes privées.",
    },
    liveVenue: {
      kicker: "OÙ NOUS ÉCOUTER EN LIVE",
      title: "Notre maison musicale à Sorrente",
      paragraphOne:
        "Depuis près de trente ans, sans interruption, Ciro & Dino accompagnent en musique les soirées du Circolo dei Forestieri – Terrazza delle Sirene, l'un des lieux les plus suggestifs au coeur de Sorrente.",
      paragraphTwo:
        "Au fil des années, cette terrasse prestigieuse est devenue notre maison musicale: un lieu de rencontre entre élégance, panorama et musique live, où chaque prestation naît d'un échange direct avec le public.",
      highlight:
        "Près de trente ans de musique live dans la même adresse prestigieuse.",
      venueName: "Circolo dei Forestieri – Terrazza delle Sirene",
      addressLine1: "Via Luigi de Maio, 35",
      addressLine2: "Sorrente",
      addressLine3: "Ville métropolitaine de Naples",
      addressLine4: "Italie",
      directions: "Itinéraire",
      directionsAriaLabel:
        "Ouvrir l'itinéraire vers Circolo dei Forestieri – Terrazza delle Sirene dans Google Maps (nouvel onglet)",
      venueContactsTitle: "Contacts de l'établissement",
      venueEmailLabel: "E-mail établissement: info@circolodeiforestieri.com",
      venuePhoneLabel: "Téléphone établissement: +39 081 877 3263",
      artisticNotePrefix:
        "Pour les demandes artistiques, disponibilités et événements privés, utilisez le",
      artisticNoteLinkLabel: "formulaire de contact",
      artisticNoteSuffix: "de Ciro & Dino Live Music.",
    },
    repertoire: {
      kicker: "Notre répertoire",
      title: "De la tradition au son international",
      description:
        "Musique italienne et napolitaine, standards internationaux, pop, rock, soul, dance et Latin : chaque prestation s’adapte à l’ambiance, au public et à l’occasion.",
      closing:
        "Chaque soirée naît de la rencontre avec le public. C'est pourquoi notre répertoire n'est jamais figé: il s'adapte à l'atmosphère, aux invités et au type d'événement, en alternant musique italienne et napolitaine, standards internationaux, pop, rock, soul, dance et sonorités latin.",
      categories: {
        italian: {
          title: "Musique italienne",
          description: "Des mélodies intemporelles et de grands succès capables de parler à plusieurs générations.",
        },
        neapolitan: {
          title: "Classiques napolitains",
          description: "Des titres de la tradition napolitaine interprétés avec chaleur, élégance et naturel.",
        },
        international: {
          title: "Standards internationaux",
          description: "Une sélection internationale pensée pour accompagner avec style des contextes raffinés.",
        },
        pop: {
          title: "Pop",
          description: "Des chansons immédiatement reconnaissables, idéales pour une atmosphère ouverte et fédératrice.",
        },
        rock: {
          title: "Rock",
          description: "Des classiques choisis avec mesure, énergie et goût, toujours au service du moment.",
        },
        soul: {
          title: "Soul",
          description: "Des sonorités chaleureuses et raffinées qui apportent profondeur, rythme et intensité.",
        },
        dance: {
          title: "Dance",
          description: "Des morceaux dynamiques sélectionnés pour faire évoluer l'ambiance quand la soirée le demande.",
        },
        latin: {
          title: "Latin",
          description: "Des couleurs et rythmes latin pour apporter chaleur, fluidité et variété au parcours musical.",
        },
      },
    },
    gallery: {
      kicker: "MOMENTS EN LIVE",
      title: "Des moments qui racontent notre musique",
      intro:
        "Chaque image préserve l'atmosphère d'une soirée, la rencontre avec le public et l'émotion de la musique live. Un parcours visuel à travers le présent et l'histoire de Ciro & Dino Live Music.",
      contemporaryTitle: "La musique, aujourd'hui",
      contemporaryText:
        "Entre instruments, voix et panoramas, chaque prestation naît de la relation directe avec le public et de l'atmosphère unique de chaque soirée.",
      historyKicker: "NOTRE PARCOURS",
      historyTitle: "Plus de trente ans de musique ensemble",
      historyText:
        "Les photographies changent, les instruments évoluent, mais la passion reste la même. Un voyage musical commencé il y a plus de trente ans et poursuivi sans interruption jusqu'à aujourd'hui.",
      historyCaptions: {
        firstYears: "Les débuts de notre voyage musical",
        fredBongusto: "Une rencontre spéciale avec Fred Bongusto",
        povia: "Avec Povia, partageant la passion de la musique",
      },
      historyItemAlts: {
        firstYears: "Ciro et Dino lors d'une des premières prestations de leur parcours musical.",
        fredBongusto: "Ciro et Dino avec Fred Bongusto sur une photographie de leur parcours artistique.",
        povia: "Ciro et Dino avec Povia lors d'une rencontre liée à la musique.",
      },
      imageAlts: {
        hero: "Ciro et Dino pendant une performance musicale au coucher du soleil.",
        ciroPortrait: "Ciro avec sa guitare devant le panorama côtier.",
        dinoPortrait: "Dino au piano devant le panorama côtier.",
        livePanorama: "Ciro et Dino pendant une prestation live sur la terrasse.",
        liveSunset: "Ciro et Dino pendant une performance au coucher du soleil.",
        historyGuitar: "Ciro et Dino sur une photographie des premières années de leur activité.",
        historyPortrait: "Ciro et Dino ensemble avec la guitare sur une photographie historique.",
        historyLive: "Ciro et Dino lors de l'un de leurs premiers concerts live.",
      },
      openImageAriaLabel: "Ouvrir l'image en grand format",
      dialogLabel: "Galerie photo de Ciro & Dino Live Music",
      closeLabel: "Fermer la galerie",
      previousLabel: "Image précédente",
      nextLabel: "Image suivante",
    },
    video: {
      kicker: "Expérience live",
      title: "Notre musique en direct",
      description:
        "Nous publierons ici une sélection de vidéos illustrant l’énergie, l’élégance et la participation du public pendant nos spectacles.",
      collections: {
        ymca: {
          subtitle: "Un morceau énergique et immédiatement reconnaissable, parfait pour transmettre élan et participation.",
          iframeTitle: "Vidéo YouTube de YMCA",
          externalAriaLabel: "Regarder YMCA sur YouTube dans un nouvel onglet",
        },
        figliDelleStelle: {
          subtitle: "Un classique élégant qui allie atmosphère et immédiateté.",
          iframeTitle: "Vidéo YouTube de Figli delle Stelle",
          externalAriaLabel: "Regarder Figli delle Stelle sur YouTube dans un nouvel onglet",
        },
        staserachesera: {
          subtitle: "Un grand titre italien qui apporte rythme et mémoire partagée.",
          iframeTitle: "Vidéo YouTube de Stasera che sera",
          externalAriaLabel: "Regarder Stasera che sera sur YouTube dans un nouvel onglet",
        },
        rossettoECaffe: {
          title: "Rouge à lèvres et café",
          subtitle: "Rouge à lèvres et café",
          iframeTitle: "Vidéo YouTube de Rouge à lèvres et café",
          externalAriaLabel: "Regarder Rouge à lèvres et café sur YouTube dans un nouvel onglet",
        },
        circoloForestieriShorts: {
          title: "Ciro & Dino au Circolo dei Forestieri",
          subtitle: "Ciro & Dino au Circolo dei Forestieri",
          iframeTitle: "Short YouTube de Ciro & Dino au Circolo dei Forestieri",
          externalAriaLabel: "Regarder Ciro & Dino au Circolo dei Forestieri sur YouTube dans un nouvel onglet",
        },
        somewhereOverTheRainbow: {
          title: "Somewhere Over The Rainbow",
          subtitle: "Une mélodie intemporelle, intime et élégante.",
          iframeTitle: "Short YouTube de Somewhere Over The Rainbow",
          externalAriaLabel: "Regarder Somewhere Over The Rainbow sur YouTube dans un nouvel onglet",
        },
        unforgettable: {
          title: "Unforgettable",
          subtitle: "Un classique raffiné, parfait pour une ambiance romantique.",
          iframeTitle: "Vidéo YouTube de Unforgettable",
          externalAriaLabel: "Regarder Unforgettable sur YouTube dans un nouvel onglet",
        },
        oiMari: {
          title: "Oi Marì",
          subtitle: "Chaleur méditerranéenne et tradition dans une interprétation captivante.",
          iframeTitle: "Vidéo YouTube de Oi Marì",
          externalAriaLabel: "Regarder Oi Marì sur YouTube dans un nouvel onglet",
        },
        stopBajon: {
          title: "Stop Bajon",
          subtitle: "Rythme et légèreté pour un moment festif.",
          iframeTitle: "Vidéo YouTube de Stop Bajon",
          externalAriaLabel: "Regarder Stop Bajon sur YouTube dans un nouvel onglet",
        },
        stayingAlive: {
          title: "Staying Alive",
          subtitle: "Une énergie dance immédiate qui fait monter l'ambiance.",
          iframeTitle: "Short YouTube de Staying Alive",
          externalAriaLabel: "Regarder Staying Alive sur YouTube dans un nouvel onglet",
        },
        quandoQuando: {
          title: "Quando Quando",
          subtitle: "Quando Quando",
          iframeTitle: "Vidéo YouTube de Quando Quando",
          externalAriaLabel: "Regarder Quando Quando sur YouTube dans un nouvel onglet",
        },
        perUnOraDAmore: {
          title: "Per un'ora d'amore",
          subtitle: "Per un'ora d'amore",
          iframeTitle: "Vidéo YouTube de Per un'ora d'amore",
          externalAriaLabel: "Regarder Per un'ora d'amore sur YouTube dans un nouvel onglet",
        },
        thisMasquerade: {
          title: "This Masquerade",
          subtitle: "This Masquerade",
          iframeTitle: "Vidéo YouTube de This Masquerade",
          externalAriaLabel: "Regarder This Masquerade sur YouTube dans un nouvel onglet",
        },
        quellaCarezzaDellaSera: {
          title: "Quella carezza della sera",
          subtitle: "Quella carezza della sera",
          iframeTitle: "Vidéo YouTube de Quella carezza della sera",
          externalAriaLabel: "Regarder Quella carezza della sera sur YouTube dans un nouvel onglet",
        },
        ilCieloInUnaStanza: {
          title: "Il cielo in una stanza",
          subtitle: "Il cielo in una stanza",
          iframeTitle: "Short YouTube de Il cielo in una stanza",
          externalAriaLabel: "Regarder Il cielo in una stanza sur YouTube dans un nouvel onglet",
        },
        guardaCheLuna: {
          title: "Guarda che luna",
          subtitle: "Guarda che luna",
          iframeTitle: "Short YouTube de Guarda che luna",
          externalAriaLabel: "Regarder Guarda che luna sur YouTube dans un nouvel onglet",
        },
        georgiaOnMyMind: {
          title: "Georgia on my mind",
          subtitle: "Georgia on my mind",
          iframeTitle: "Short YouTube de Georgia on my mind",
          externalAriaLabel: "Regarder Georgia on my mind sur YouTube dans un nouvel onglet",
        },
        volare: {
          title: "Volare",
          subtitle: "Volare",
          iframeTitle: "Short YouTube de Volare",
          externalAriaLabel: "Regarder Volare sur YouTube dans un nouvel onglet",
        },
        ePensoATe: {
          title: "E penso a te",
          subtitle: "E penso a te",
          iframeTitle: "Vidéo YouTube de E penso a te",
          externalAriaLabel: "Regarder E penso a te sur YouTube dans un nouvel onglet",
        },
        mamboItaliano: {
          title: "Mambo Italiano",
          subtitle: "Mambo Italiano",
          iframeTitle: "Short YouTube de Mambo Italiano",
          externalAriaLabel: "Regarder Mambo Italiano sur YouTube dans un nouvel onglet",
        },
      },
      externalLinkText: "Regarder sur YouTube",
      youtubeCta: {
        title: "Découvrez toutes nos vidéos",
        text: "Retrouvez sur notre chaîne YouTube de nombreuses performances live, de nouvelles vidéos et toutes nos nouveautés.",
        button: "Visiter notre chaîne YouTube",
      },
    },
    audio: {
      kicker: "AUDIO",
      title: "Écoutez notre musique",
      description:
        "Trois collections pensées pour raconter les différentes facettes de notre répertoire : l’émotion, l’énergie et les grands classiques intemporels.",
      collections: {
        love: {
          title: "Love Collection",
          subtitle:
            "Une sélection de morceaux romantiques et mélodiques, pensée pour accompagner les moments les plus émouvants.",
          iframeTitle: "Lecteur SoundCloud pour Love Collection",
          externalAriaLabel: "Écouter Love Collection sur SoundCloud dans un nouvel onglet",
        },
        party: {
          title: "Party Collection",
          subtitle:
            "Une collection de morceaux rythmés et entraînants pour les fêtes, les réceptions et les événements pleins d’énergie.",
          iframeTitle: "Lecteur SoundCloud pour Party Collection",
          externalAriaLabel: "Écouter Party Collection sur SoundCloud dans un nouvel onglet",
        },
        timeless: {
          title: "Timeless Classics Collection",
          subtitle:
            "De grands classiques italiens et internationaux qui continuent d’émouvoir de génération en génération.",
          iframeTitle: "Lecteur SoundCloud pour Timeless Classics Collection",
          externalAriaLabel: "Écouter Timeless Classics Collection sur SoundCloud dans un nouvel onglet",
        },
      },
      externalLinkText: "Écouter sur SoundCloud",
      showAll: "Voir tous les audios",
      showLess: "Voir moins d'audios",
      tracklistButton: "Voir la liste des titres du mix",
      tracklistHide: "Masquer la liste des titres",
      tracklistExport: "Exporter la liste des titres",
      tracklistHeading: "Liste des titres",
      tracklistClose: "Fermer",
    },
    contacts: {
      kicker: "Contacts",
      title: "Musique live pour hôtels, événements et soirées spéciales",
      subtitle: "Parlons de votre événement",
      description:
        "Remplissez le formulaire : nous vous répondrons rapidement avec une proposition adaptée.",
      fields: {
        fullName: "Nom et prénom",
        email: "E-mail",
        eventType: "Type d'événement",
        eventDate: "Date de l'événement",
        location: "Lieu",
        message: "Message",
        consent: "J'accepte le traitement de mes données personnelles pour être recontacté.",
      },
      eventTypes: {
        hotel: "Hôtel",
        wedding: "Mariage",
        private_party: "Fête privée",
        corporate: "Événement d'entreprise",
        other: "Autre",
      },
      placeholders: {
        fullName: "Ex. Jean Dupont",
        email: "nom@exemple.com",
        location: "Ex. Nice",
        message: "Indiquez la date, les horaires et l'ambiance souhaitée...",
      },
      submit: "Envoyer la demande",
      sending: "Envoi en cours...",
      success: "Message envoyé avec succès. Nous vous répondrons rapidement.",
      error: "Une erreur est survenue lors de l'envoi. Veuillez réessayer dans quelques minutes.",
      validation: {
        fullName: "Saisissez le nom et prénom (au moins 2 caractères).",
        email: "Saisissez une adresse e-mail valide.",
        eventType: "Sélectionnez un type d'événement.",
        message: "Saisissez un message d'au moins 10 caractères.",
        consent: "Vous devez accepter le traitement des données pour envoyer la demande.",
      },
    },
    changeLanguage: "Changer de langue",
  },

  es: {
    languageName: "Español",
    enterTitle: "Select your language",
    enterSubtitle: "Music that creates emotions",    
	nav: {
      home: "Inicio",
      about: "Quiénes somos",
      audio: "Audio",
      repertoire: "Repertorio",
      gallery: "Galería",
      video: "Vídeo",
      contacts: "Contacto",
    },
    hero: {
      eyebrow: "Bienvenidos a nuestra música",
      subtitle: "Música para momentos inolvidables",
      scroll: "Descubre",
    },
    about: {
      kicker: "NUESTRA HISTORIA",
      title: "contada a través de la música",
      intro:
        "Cada velada es un encuentro. Cada canción cuenta una emoción.",
      paragraphOne:
        "Para nosotros la música no es solo una profesión: es la forma más auténtica de comunicar, emocionar y crear recuerdos que perduran en el tiempo. Ciro & Dino Live Music nace del encuentro de dos trayectorias artísticas unidas por la misma pasión: llevar al escenario elegancia, calidad musical y una relación sincera con el público. Con teclados, guitarra y voces damos vida a espectáculos en directo capaces de adaptarse de forma natural a la atmósfera de cada evento.",
      paragraphTwo:
        "Desde hace cerca de treinta años acompañamos de manera constante las veladas del histórico Circolo dei Forestieri de Sorrento, actuando ante invitados de todo el mundo. Esta larga experiencia nos ha enseñado que cada público es distinto y que cada ocasión requiere sensibilidad, escucha y la capacidad de elegir la música adecuada en el momento justo. Nuestro repertorio recorre más de sesenta años de grandes éxitos: desde las mejores melodías italianas y napolitanas hasta estándares internacionales, además de grandes clásicos pop, rock, soul, dance y latin que siguen emocionando a generaciones diferentes.",
      paragraphThree:
        "Ya sea una cena elegante, una recepción, una fiesta privada o una noche dedicada al baile, construimos cada actuación con un único objetivo: crear una atmósfera envolvente, refinada y capaz de dejar un recuerdo especial. Con los años hemos aprendido que el valor de la música en directo no se mide solo en la calidad de la interpretación, sino en la capacidad de transformar una noche cualquiera en una experiencia para recordar. Con ese espíritu subimos al escenario, cada vez.",
      pointExperience: "Más de treinta años de experiencia en música en directo.",
      pointRepertoire:
        "Repertorio italiano, napolitano e internacional, en constante actualización.",
      pointTailored:
        "Actuaciones personalizadas para recepciones, eventos exclusivos y fiestas privadas.",
    },
    liveVenue: {
      kicker: "DÓNDE ESCUCHARNOS EN DIRECTO",
      title: "Nuestra casa musical en Sorrento",
      paragraphOne:
        "Desde hace cerca de treinta años, sin interrupciones, Ciro & Dino acompañan con su música las veladas del Circolo dei Forestieri – Terrazza delle Sirene, uno de los lugares más evocadores en el corazón de Sorrento.",
      paragraphTwo:
        "Con el paso de los años, esta prestigiosa terraza se ha convertido en nuestra casa musical: un punto de encuentro entre elegancia, paisaje y música en vivo, donde cada actuación nace de la relación directa con el público.",
      highlight:
        "Cerca de treinta años de música en directo en la misma sede prestigiosa.",
      venueName: "Circolo dei Forestieri – Terrazza delle Sirene",
      addressLine1: "Via Luigi de Maio, 35",
      addressLine2: "Sorrento",
      addressLine3: "Ciudad Metropolitana de Nápoles",
      addressLine4: "Italia",
      directions: "Indicaciones",
      directionsAriaLabel:
        "Abrir indicaciones a Circolo dei Forestieri – Terrazza delle Sirene en Google Maps (nueva pestaña)",
      venueContactsTitle: "Contactos del local",
      venueEmailLabel: "Email del local: info@circolodeiforestieri.com",
      venuePhoneLabel: "Teléfono del local: +39 081 877 3263",
      artisticNotePrefix:
        "Para información artística, disponibilidad y eventos privados, utiliza el",
      artisticNoteLinkLabel: "formulario de contacto",
      artisticNoteSuffix: "de Ciro & Dino Live Music.",
    },
    repertoire: {
      kicker: "Nuestro repertorio",
      title: "De la tradición al sonido internacional",
      description:
        "Música italiana y napolitana, estándares internacionales, pop, rock, soul, dance y Latin: cada actuación se adapta al ambiente, al público y a la ocasión.",
      closing:
        "Cada velada nace del encuentro con el público. Por eso nuestro repertorio nunca es rígido: se adapta a la atmósfera, a los invitados y al tipo de evento, alternando música italiana y napolitana, estándares internacionales, pop, rock, soul, dance y sonoridades latin.",
      categories: {
        italian: {
          title: "Música italiana",
          description: "Melodías atemporales y grandes éxitos capaces de conectar con públicos de distintas generaciones.",
        },
        neapolitan: {
          title: "Clásicos napolitanos",
          description: "Canciones de la tradición napolitana interpretadas con calidez, elegancia y naturalidad.",
        },
        international: {
          title: "Estándares internacionales",
          description: "Una selección internacional pensada para acompañar con estilo ambientes refinados.",
        },
        pop: {
          title: "Pop",
          description: "Canciones reconocibles y transversales, ideales para crear una atmósfera abierta y participativa.",
        },
        rock: {
          title: "Rock",
          description: "Clásicos elegidos con equilibrio, energía y buen gusto, siempre al servicio del momento.",
        },
        soul: {
          title: "Soul",
          description: "Sonidos cálidos y refinados que aportan profundidad, ritmo e intensidad emocional.",
        },
        dance: {
          title: "Dance",
          description: "Temas dinámicos seleccionados para elevar la energía cuando la ocasión lo pide.",
        },
        latin: {
          title: "Latin",
          description: "Colores y ritmos latin que aportan calidez, fluidez y variedad al recorrido musical.",
        },
      },
    },
    gallery: {
      kicker: "MOMENTOS EN DIRECTO",
      title: "Momentos que cuentan nuestra música",
      intro:
        "Cada imagen conserva la atmósfera de una velada, el encuentro con el público y la emoción de la música en vivo. Un recorrido visual por el presente y la historia de Ciro & Dino Live Music.",
      contemporaryTitle: "La música, hoy",
      contemporaryText:
        "Entre instrumentos, voces y panoramas, cada actuación nace de la relación directa con el público y de la atmósfera única de cada noche.",
      historyKicker: "NUESTRO RECORRIDO",
      historyTitle: "Más de treinta años de música juntos",
      historyText:
        "Las fotografías cambian y los instrumentos evolucionan, pero la pasión sigue siendo la misma. Un viaje musical iniciado hace más de treinta años y continuado sin interrupción hasta hoy.",
      historyCaptions: {
        firstYears: "Los inicios de nuestro viaje musical",
        fredBongusto: "Un encuentro especial con Fred Bongusto",
        povia: "Con Povia, compartiendo la pasión por la música",
      },
      historyItemAlts: {
        firstYears: "Ciro y Dino durante una de las primeras actuaciones de su recorrido musical.",
        fredBongusto: "Ciro y Dino junto a Fred Bongusto en una fotografía de su trayectoria artística.",
        povia: "Ciro y Dino junto a Povia durante un encuentro relacionado con la música.",
      },
      imageAlts: {
        hero: "Ciro y Dino durante una actuación musical al atardecer.",
        ciroPortrait: "Ciro con la guitarra frente al panorama costero.",
        dinoPortrait: "Dino al piano frente al panorama costero.",
        livePanorama: "Ciro y Dino durante una actuación en vivo en la terraza.",
        liveSunset: "Ciro y Dino durante una actuación al atardecer.",
        historyGuitar: "Ciro y Dino en una fotografía de los primeros años de su trayectoria.",
        historyPortrait: "Ciro y Dino juntos con la guitarra en una fotografía histórica.",
        historyLive: "Ciro y Dino durante una de sus primeras actuaciones en vivo.",
      },
      openImageAriaLabel: "Abrir imagen en gran formato",
      dialogLabel: "Galería fotográfica de Ciro & Dino Live Music",
      closeLabel: "Cerrar galería",
      previousLabel: "Imagen anterior",
      nextLabel: "Imagen siguiente",
    },
    video: {
      kicker: "Experiencia en vivo",
      title: "Nuestra música en directo",
      description:
        "Aquí publicaremos una selección de vídeos que muestran la energía, la elegancia y la participación del público en nuestras actuaciones.",
      collections: {
        ymca: {
          subtitle: "Un tema enérgico e inmediatamente reconocible, perfecto para transmitir impulso y participación.",
          iframeTitle: "Vídeo de YouTube de YMCA",
          externalAriaLabel: "Ver YMCA en YouTube en una nueva pestaña",
        },
        figliDelleStelle: {
          subtitle: "Un clásico elegante que combina atmósfera e inmediatez.",
          iframeTitle: "Vídeo de YouTube de Figli delle Stelle",
          externalAriaLabel: "Ver Figli delle Stelle en YouTube en una nueva pestaña",
        },
        staserachesera: {
          subtitle: "Un gran tema italiano que aporta ritmo y memoria compartida.",
          iframeTitle: "Vídeo de YouTube de Stasera che sera",
          externalAriaLabel: "Ver Stasera che sera en YouTube en una nueva pestaña",
        },
        rossettoECaffe: {
          title: "Pintalabios y café",
          subtitle: "Pintalabios y café",
          iframeTitle: "Vídeo de YouTube de Pintalabios y café",
          externalAriaLabel: "Ver Pintalabios y café en YouTube en una nueva pestaña",
        },
        circoloForestieriShorts: {
          title: "Ciro & Dino en el Circolo dei Forestieri",
          subtitle: "Ciro & Dino en el Circolo dei Forestieri",
          iframeTitle: "Short de YouTube de Ciro & Dino en el Circolo dei Forestieri",
          externalAriaLabel: "Ver Ciro & Dino en el Circolo dei Forestieri en YouTube en una nueva pestaña",
        },
        somewhereOverTheRainbow: {
          title: "Somewhere Over The Rainbow",
          subtitle: "Una melodía atemporal, íntima y elegante.",
          iframeTitle: "Short de YouTube de Somewhere Over The Rainbow",
          externalAriaLabel: "Ver Somewhere Over The Rainbow en YouTube en una nueva pestaña",
        },
        unforgettable: {
          title: "Unforgettable",
          subtitle: "Un clásico refinado, ideal para ambientes románticos.",
          iframeTitle: "Vídeo de YouTube de Unforgettable",
          externalAriaLabel: "Ver Unforgettable en YouTube en una nueva pestaña",
        },
        oiMari: {
          title: "Oi Marì",
          subtitle: "Tradición y calidez mediterránea en una interpretación envolvente.",
          iframeTitle: "Vídeo de YouTube de Oi Marì",
          externalAriaLabel: "Ver Oi Marì en YouTube en una nueva pestaña",
        },
        stopBajon: {
          title: "Stop Bajon",
          subtitle: "Ritmo y ligereza para un momento de fiesta.",
          iframeTitle: "Vídeo de YouTube de Stop Bajon",
          externalAriaLabel: "Ver Stop Bajon en YouTube en una nueva pestaña",
        },
        stayingAlive: {
          title: "Staying Alive",
          subtitle: "Energía dance inmediata para encender la noche.",
          iframeTitle: "Short de YouTube de Staying Alive",
          externalAriaLabel: "Ver Staying Alive en YouTube en una nueva pestaña",
        },
        quandoQuando: {
          title: "Quando Quando",
          subtitle: "Quando Quando",
          iframeTitle: "Vídeo de YouTube de Quando Quando",
          externalAriaLabel: "Ver Quando Quando en YouTube en una nueva pestaña",
        },
        perUnOraDAmore: {
          title: "Per un'ora d'amore",
          subtitle: "Per un'ora d'amore",
          iframeTitle: "Vídeo de YouTube de Per un'ora d'amore",
          externalAriaLabel: "Ver Per un'ora d'amore en YouTube en una nueva pestaña",
        },
        thisMasquerade: {
          title: "This Masquerade",
          subtitle: "This Masquerade",
          iframeTitle: "Vídeo de YouTube de This Masquerade",
          externalAriaLabel: "Ver This Masquerade en YouTube en una nueva pestaña",
        },
        quellaCarezzaDellaSera: {
          title: "Quella carezza della sera",
          subtitle: "Quella carezza della sera",
          iframeTitle: "Vídeo de YouTube de Quella carezza della sera",
          externalAriaLabel: "Ver Quella carezza della sera en YouTube en una nueva pestaña",
        },
        ilCieloInUnaStanza: {
          title: "Il cielo in una stanza",
          subtitle: "Il cielo in una stanza",
          iframeTitle: "Short de YouTube de Il cielo in una stanza",
          externalAriaLabel: "Ver Il cielo in una stanza en YouTube en una nueva pestaña",
        },
        guardaCheLuna: {
          title: "Guarda che luna",
          subtitle: "Guarda che luna",
          iframeTitle: "Short de YouTube de Guarda che luna",
          externalAriaLabel: "Ver Guarda che luna en YouTube en una nueva pestaña",
        },
        georgiaOnMyMind: {
          title: "Georgia on my mind",
          subtitle: "Georgia on my mind",
          iframeTitle: "Short de YouTube de Georgia on my mind",
          externalAriaLabel: "Ver Georgia on my mind en YouTube en una nueva pestaña",
        },
        volare: {
          title: "Volare",
          subtitle: "Volare",
          iframeTitle: "Short de YouTube de Volare",
          externalAriaLabel: "Ver Volare en YouTube en una nueva pestaña",
        },
        ePensoATe: {
          title: "E penso a te",
          subtitle: "E penso a te",
          iframeTitle: "Vídeo de YouTube de E penso a te",
          externalAriaLabel: "Ver E penso a te en YouTube en una nueva pestaña",
        },
        mamboItaliano: {
          title: "Mambo Italiano",
          subtitle: "Mambo Italiano",
          iframeTitle: "Short de YouTube de Mambo Italiano",
          externalAriaLabel: "Ver Mambo Italiano en YouTube en una nueva pestaña",
        },
      },
      externalLinkText: "Ver en YouTube",
      youtubeCta: {
        title: "Descubre todos nuestros vídeos",
        text: "En nuestro canal de YouTube encontrarás muchas más actuaciones en directo, nuevos vídeos y novedades.",
        button: "Visitar nuestro canal de YouTube",
      },
    },
    audio: {
      kicker: "AUDIO",
      title: "Escucha nuestra música",
      description:
        "Tres recopilaciones pensadas para reflejar las distintas facetas de nuestro repertorio: la emoción, la energía y los grandes clásicos de siempre.",
      collections: {
        love: {
          title: "Love Collection",
          subtitle:
            "Una selección de canciones románticas y melódicas, pensada para acompañar los momentos más emotivos.",
          iframeTitle: "Reproductor de SoundCloud para Love Collection",
          externalAriaLabel: "Escuchar Love Collection en SoundCloud en una nueva pestaña",
        },
        party: {
          title: "Party Collection",
          subtitle:
            "Una recopilación de temas rítmicos y envolventes para fiestas, recepciones y eventos llenos de energía.",
          iframeTitle: "Reproductor de SoundCloud para Party Collection",
          externalAriaLabel: "Escuchar Party Collection en SoundCloud en una nueva pestaña",
        },
        timeless: {
          title: "Timeless Classics Collection",
          subtitle:
            "Grandes clásicos italianos e internacionales que siguen emocionando de generación en generación.",
          iframeTitle: "Reproductor de SoundCloud para Timeless Classics Collection",
          externalAriaLabel: "Escuchar Timeless Classics Collection en SoundCloud en una nueva pestaña",
        },
      },
      externalLinkText: "Escuchar en SoundCloud",
      showAll: "Ver todos los audios",
      showLess: "Ver menos audios",
      tracklistButton: "Ver lista de temas del mix",
      tracklistHide: "Ocultar lista de temas",
      tracklistExport: "Exportar lista de temas",
      tracklistHeading: "Lista de temas",
      tracklistClose: "Cerrar",
    },
    contacts: {
      kicker: "Contacto",
      title: "Música en directo para hoteles, eventos y noches especiales",
      subtitle: "Hablemos de tu evento",
      description:
        "Completa el formulario y te responderemos pronto con una propuesta personalizada.",
      fields: {
        fullName: "Nombre y apellidos",
        email: "Correo electrónico",
        eventType: "Tipo de evento",
        eventDate: "Fecha del evento",
        location: "Localidad",
        message: "Mensaje",
        consent: "Acepto el tratamiento de mis datos personales para ser contactado.",
      },
      eventTypes: {
        hotel: "Hotel",
        wedding: "Boda",
        private_party: "Fiesta privada",
        corporate: "Evento corporativo",
        other: "Otro",
      },
      placeholders: {
        fullName: "Ej. Juan Pérez",
        email: "nombre@ejemplo.com",
        location: "Ej. Madrid",
        message: "Cuéntanos la fecha, horarios y ambiente que deseas...",
      },
      submit: "Enviar solicitud",
      sending: "Envío en curso...",
      success: "Mensaje enviado correctamente. Te responderemos muy pronto.",
      error: "Se produjo un error al enviar el mensaje. Inténtalo de nuevo en unos minutos.",
      validation: {
        fullName: "Introduce nombre y apellidos (al menos 2 caracteres).",
        email: "Introduce un correo electrónico válido.",
        eventType: "Selecciona el tipo de evento.",
        message: "Introduce un mensaje de al menos 10 caracteres.",
        consent: "Debes aceptar el tratamiento de datos para enviar la solicitud.",
      },
    },
    changeLanguage: "Cambiar idioma",
  },

  de: {
    languageName: "Deutsch",
    enterTitle: "Select your language",
    enterSubtitle: "Music that creates emotions",    
	nav: {
      home: "Home",
      about: "Über uns",
      audio: "Audio",
      repertoire: "Repertoire",
      gallery: "Galerie",
      video: "Video",
      contacts: "Kontakt",
    },
    hero: {
      eyebrow: "Willkommen zu unserer Musik",
      subtitle: "Musik für unvergessliche Momente",
      scroll: "Entdecken",
    },
    about: {
      kicker: "UNSERE GESCHICHTE",
      title: "durch Musik erzählt",
      intro:
        "Jeder Abend ist eine Begegnung. Jedes Lied erzählt ein Gefühl.",
      paragraphOne:
        "Für uns ist Musik nicht nur ein Beruf: Sie ist die authentischste Art zu kommunizieren, zu berühren und Erinnerungen zu schaffen, die bleiben. Ciro & Dino Live Music entstand aus dem Zusammentreffen zweier künstlerischer Wege mit derselben Leidenschaft: Eleganz, musikalische Qualität und eine ehrliche Beziehung zum Publikum auf die Bühne zu bringen. Mit Keyboards, Gitarre und Gesang gestalten wir Live-Auftritte, die sich natürlich an die Atmosphäre jeder Veranstaltung anpassen.",
      paragraphTwo:
        "Seit rund dreißig Jahren begleiten wir regelmäßig die Abende im historischen Circolo dei Forestieri in Sorrent und treten vor Gästen aus aller Welt auf. Diese lange Erfahrung hat uns gelehrt, dass jedes Publikum anders ist und jeder Anlass Sensibilität, Zuhören und die Fähigkeit verlangt, im richtigen Moment die passende Musik zu wählen. Unser Repertoire umfasst mehr als sechzig Jahre großer Erfolge: von den schönsten italienischen und neapolitanischen Melodien über internationale Standards bis hin zu großen Pop-, Rock-, Soul-, Dance- und Latin-Klassikern, die bis heute verschiedene Generationen begeistern.",
      paragraphThree:
        "Ob elegantes Dinner, Empfang, private Feier oder Tanzabend: Wir entwickeln jeden Auftritt mit einem klaren Ziel, eine mitreißende und zugleich stilvolle Atmosphäre zu schaffen, die in Erinnerung bleibt. Im Laufe der Jahre haben wir gelernt, dass sich der Wert von Live-Musik nicht nur an der Qualität der Ausführung misst, sondern an der Fähigkeit, einen einfachen Abend in ein besonderes Erlebnis zu verwandeln. Mit genau diesem Geist stehen wir jedes Mal auf der Bühne.",
      pointExperience: "Mehr als dreißig Jahre Erfahrung in der Live-Musik.",
      pointRepertoire:
        "Italienisches, neapolitanisches und internationales Repertoire, kontinuierlich aktualisiert.",
      pointTailored:
        "Individuelle Performances für Empfänge, exklusive Events und private Feiern.",
    },
    liveVenue: {
      kicker: "WO MAN UNS LIVE HÖRT",
      title: "Unser musikalisches Zuhause in Sorrent",
      paragraphOne:
        "Seit rund dreißig Jahren, ohne Unterbrechung, begleiten Ciro & Dino die Abende im Circolo dei Forestieri – Terrazza delle Sirene musikalisch, einem der stimmungsvollsten Orte im Herzen von Sorrent.",
      paragraphTwo:
        "Im Laufe der Jahre ist diese renommierte Terrasse zu unserem musikalischen Zuhause geworden: ein Ort, an dem Eleganz, Panorama und Live-Musik zusammenkommen und jeder Auftritt aus dem direkten Kontakt mit dem Publikum entsteht.",
      highlight:
        "Rund dreißig Jahre Live-Musik am selben renommierten Veranstaltungsort.",
      venueName: "Circolo dei Forestieri – Terrazza delle Sirene",
      addressLine1: "Via Luigi de Maio, 35",
      addressLine2: "Sorrent",
      addressLine3: "Metropolitanstadt Neapel",
      addressLine4: "Italien",
      directions: "Anfahrt",
      directionsAriaLabel:
        "Anfahrt zum Circolo dei Forestieri – Terrazza delle Sirene in Google Maps öffnen (neuer Tab)",
      venueContactsTitle: "Kontakte des Hauses",
      venueEmailLabel: "E-Mail des Hauses: info@circolodeiforestieri.com",
      venuePhoneLabel: "Telefon des Hauses: +39 081 877 3263",
      artisticNotePrefix:
        "Für künstlerische Anfragen, Verfügbarkeit und private Events nutzen Sie bitte das",
      artisticNoteLinkLabel: "Kontaktformular",
      artisticNoteSuffix: "von Ciro & Dino Live Music.",
    },
    repertoire: {
      kicker: "Unser Repertoire",
      title: "Von der Tradition zum internationalen Sound",
      description:
        "Italienische und neapolitanische Musik, internationale Standards, Pop, Rock, Soul, Dance und Latin: Jeder Auftritt wird an Atmosphäre, Publikum und Anlass angepasst.",
      closing:
        "Jeder Abend entsteht aus der Begegnung mit dem Publikum. Deshalb ist unser Repertoire nie starr: Es passt sich der Atmosphäre, den Gästen und der Art der Veranstaltung an und verbindet italienische und neapolitanische Musik, internationale Standards, Pop, Rock, Soul, Dance und Latin-Klänge.",
      categories: {
        italian: {
          title: "Italienische Musik",
          description: "Zeitlose Melodien und große Erfolge, die Menschen verschiedener Generationen erreichen.",
        },
        neapolitan: {
          title: "Neapolitanische Klassiker",
          description: "Lieder der neapolitanischen Tradition, interpretiert mit Wärme, Eleganz und Natürlichkeit.",
        },
        international: {
          title: "Internationale Standards",
          description: "Eine internationale Auswahl, die stilvoll in elegante und kosmopolitische Rahmen passt.",
        },
        pop: {
          title: "Pop",
          description: "Wiedererkennbare Songs mit großer Reichweite, ideal für eine offene und mitreißende Atmosphäre.",
        },
        rock: {
          title: "Rock",
          description: "Sorgfältig gewählte Klassiker mit Energie und Charakter, immer passend zum Moment des Abends.",
        },
        soul: {
          title: "Soul",
          description: "Warme, elegante Klangfarben, die Tiefe, Groove und emotionale Intensität hinzufügen.",
        },
        dance: {
          title: "Dance",
          description: "Dynamische Titel, die ausgewählt werden, wenn der Abend mehr Bewegung und Schwung verlangt.",
        },
        latin: {
          title: "Latin",
          description: "Latin-Farben und Rhythmen, die Wärme, Fluss und Vielfalt in das Programm bringen.",
        },
      },
    },
    gallery: {
      kicker: "LIVE-MOMENTE",
      title: "Momente, die unsere Musik erzählen",
      intro:
        "Jedes Bild bewahrt die Atmosphäre eines Abends, die Begegnung mit dem Publikum und die Emotion der Live-Musik. Eine visuelle Reise durch die Gegenwart und die Geschichte von Ciro & Dino Live Music.",
      contemporaryTitle: "Die Musik, heute",
      contemporaryText:
        "Zwischen Instrumenten, Stimmen und Panoramen entsteht jeder Auftritt aus der direkten Verbindung mit dem Publikum und der einzigartigen Stimmung jedes Abends.",
      historyKicker: "UNSER WEG",
      historyTitle: "Mehr als dreißig Jahre Musik gemeinsam",
      historyText:
        "Fotografien verändern sich, Instrumente entwickeln sich weiter, doch die Leidenschaft bleibt dieselbe. Eine musikalische Reise, die vor mehr als dreißig Jahren begann und bis heute ohne Unterbrechung weitergeht.",
      historyCaptions: {
        firstYears: "Die Anfänge unserer musikalischen Reise",
        fredBongusto: "Eine besondere Begegnung mit Fred Bongusto",
        povia: "Mit Povia, vereint durch die Leidenschaft für Musik",
      },
      historyItemAlts: {
        firstYears: "Ciro und Dino bei einem ihrer ersten Auftritte auf ihrem musikalischen Weg.",
        fredBongusto: "Ciro und Dino mit Fred Bongusto auf einem Foto aus ihrem künstlerischen Weg.",
        povia: "Ciro und Dino mit Povia bei einer musikbezogenen Begegnung.",
      },
      imageAlts: {
        hero: "Ciro und Dino bei einem musikalischen Auftritt im Sonnenuntergang.",
        ciroPortrait: "Ciro mit Gitarre vor der Kuestenlandschaft.",
        dinoPortrait: "Dino am Klavier vor der Kuestenlandschaft.",
        livePanorama: "Ciro und Dino bei einem Live-Auftritt auf der Terrasse.",
        liveSunset: "Ciro und Dino bei einer Performance im Sonnenuntergang.",
        historyGuitar: "Ciro und Dino auf einem Foto aus den ersten Jahren ihrer Taetigkeit.",
        historyPortrait: "Ciro und Dino gemeinsam mit Gitarre auf einem historischen Foto.",
        historyLive: "Ciro und Dino bei einem ihrer ersten Live-Auftritte.",
      },
      openImageAriaLabel: "Bild in Großansicht öffnen",
      dialogLabel: "Fotogalerie von Ciro & Dino Live Music",
      closeLabel: "Galerie schließen",
      previousLabel: "Vorheriges Bild",
      nextLabel: "Nächstes Bild",
    },
    video: {
      kicker: "Live-Erlebnis",
      title: "Unsere Live-Musik",
      description:
        "Hier veröffentlichen wir eine Auswahl an Videos, die die Energie, Eleganz und Publikumsnähe unserer Auftritte zeigen.",
      collections: {
        ymca: {
          subtitle: "Ein energiegeladener und sofort wiedererkennbarer Titel, perfekt für Schwung und Publikumsnähe.",
          iframeTitle: "YouTube-Video von YMCA",
          externalAriaLabel: "YMCA auf YouTube in einem neuen Tab ansehen",
        },
        figliDelleStelle: {
          subtitle: "Ein eleganter Klassiker, der Atmosphäre und Direktheit verbindet.",
          iframeTitle: "YouTube-Video von Figli delle Stelle",
          externalAriaLabel: "Figli delle Stelle auf YouTube in einem neuen Tab ansehen",
        },
        staserachesera: {
          subtitle: "Ein großer italienischer Titel, der Rhythmus und gemeinsame Erinnerung vermittelt.",
          iframeTitle: "YouTube-Video von Stasera che sera",
          externalAriaLabel: "Stasera che sera auf YouTube in einem neuen Tab ansehen",
        },
        rossettoECaffe: {
          title: "Lippenstift und Kaffee",
          subtitle: "Lippenstift und Kaffee",
          iframeTitle: "YouTube-Video von Lippenstift und Kaffee",
          externalAriaLabel: "Lippenstift und Kaffee auf YouTube in einem neuen Tab ansehen",
        },
        circoloForestieriShorts: {
          title: "Ciro & Dino im Circolo dei Forestieri",
          subtitle: "Ciro & Dino im Circolo dei Forestieri",
          iframeTitle: "YouTube-Short von Ciro & Dino im Circolo dei Forestieri",
          externalAriaLabel: "Ciro & Dino im Circolo dei Forestieri auf YouTube in einem neuen Tab ansehen",
        },
        somewhereOverTheRainbow: {
          title: "Somewhere Over The Rainbow",
          subtitle: "Eine zeitlose Melodie mit intimer und eleganter Atmosphäre.",
          iframeTitle: "YouTube-Short von Somewhere Over The Rainbow",
          externalAriaLabel: "Somewhere Over The Rainbow auf YouTube in einem neuen Tab ansehen",
        },
        unforgettable: {
          title: "Unforgettable",
          subtitle: "Ein raffinierter Klassiker, ideal für romantische Stimmungen.",
          iframeTitle: "YouTube-Video von Unforgettable",
          externalAriaLabel: "Unforgettable auf YouTube in einem neuen Tab ansehen",
        },
        oiMari: {
          title: "Oi Marì",
          subtitle: "Mediterrane Wärme und Tradition in einer mitreißenden Interpretation.",
          iframeTitle: "YouTube-Video von Oi Marì",
          externalAriaLabel: "Oi Marì auf YouTube in einem neuen Tab ansehen",
        },
        stopBajon: {
          title: "Stop Bajon",
          subtitle: "Rhythmus und Leichtigkeit für einen festlichen Moment.",
          iframeTitle: "YouTube-Video von Stop Bajon",
          externalAriaLabel: "Stop Bajon auf YouTube in einem neuen Tab ansehen",
        },
        stayingAlive: {
          title: "Staying Alive",
          subtitle: "Sofortige Dance-Energie, die den Abend in Bewegung bringt.",
          iframeTitle: "YouTube-Short von Staying Alive",
          externalAriaLabel: "Staying Alive auf YouTube in einem neuen Tab ansehen",
        },
        quandoQuando: {
          title: "Quando Quando",
          subtitle: "Quando Quando",
          iframeTitle: "YouTube-Video von Quando Quando",
          externalAriaLabel: "Quando Quando auf YouTube in einem neuen Tab ansehen",
        },
        perUnOraDAmore: {
          title: "Per un'ora d'amore",
          subtitle: "Per un'ora d'amore",
          iframeTitle: "YouTube-Video von Per un'ora d'amore",
          externalAriaLabel: "Per un'ora d'amore auf YouTube in einem neuen Tab ansehen",
        },
        thisMasquerade: {
          title: "This Masquerade",
          subtitle: "This Masquerade",
          iframeTitle: "YouTube-Video von This Masquerade",
          externalAriaLabel: "This Masquerade auf YouTube in einem neuen Tab ansehen",
        },
        quellaCarezzaDellaSera: {
          title: "Quella carezza della sera",
          subtitle: "Quella carezza della sera",
          iframeTitle: "YouTube-Video von Quella carezza della sera",
          externalAriaLabel: "Quella carezza della sera auf YouTube in einem neuen Tab ansehen",
        },
        ilCieloInUnaStanza: {
          title: "Il cielo in una stanza",
          subtitle: "Il cielo in una stanza",
          iframeTitle: "YouTube-Short von Il cielo in una stanza",
          externalAriaLabel: "Il cielo in una stanza auf YouTube in einem neuen Tab ansehen",
        },
        guardaCheLuna: {
          title: "Guarda che luna",
          subtitle: "Guarda che luna",
          iframeTitle: "YouTube-Short von Guarda che luna",
          externalAriaLabel: "Guarda che luna auf YouTube in einem neuen Tab ansehen",
        },
        georgiaOnMyMind: {
          title: "Georgia on my mind",
          subtitle: "Georgia on my mind",
          iframeTitle: "YouTube-Short von Georgia on my mind",
          externalAriaLabel: "Georgia on my mind auf YouTube in einem neuen Tab ansehen",
        },
        volare: {
          title: "Volare",
          subtitle: "Volare",
          iframeTitle: "YouTube-Short von Volare",
          externalAriaLabel: "Volare auf YouTube in einem neuen Tab ansehen",
        },
        ePensoATe: {
          title: "E penso a te",
          subtitle: "E penso a te",
          iframeTitle: "YouTube-Video von E penso a te",
          externalAriaLabel: "E penso a te auf YouTube in einem neuen Tab ansehen",
        },
        mamboItaliano: {
          title: "Mambo Italiano",
          subtitle: "Mambo Italiano",
          iframeTitle: "YouTube-Short von Mambo Italiano",
          externalAriaLabel: "Mambo Italiano auf YouTube in einem neuen Tab ansehen",
        },
      },
      externalLinkText: "Auf YouTube ansehen",
      youtubeCta: {
        title: "Entdecke alle unsere Videos",
        text: "Auf unserem YouTube-Kanal findest du viele weitere Live-Auftritte, neue Videos und aktuelle Neuigkeiten.",
        button: "Unseren YouTube-Kanal besuchen",
      },
    },
    audio: {
      kicker: "AUDIO",
      title: "Hören Sie unsere Musik",
      description:
        "Drei Kollektionen, die die unterschiedlichen Facetten unseres Repertoires erzählen: Emotion, Energie und zeitlose Klassiker.",
      collections: {
        love: {
          title: "Love Collection",
          subtitle:
            "Eine Auswahl romantischer und melodischer Songs, die die emotionalsten Momente begleiten soll.",
          iframeTitle: "SoundCloud-Player für Love Collection",
          externalAriaLabel: "Love Collection auf SoundCloud in einem neuen Tab anhören",
        },
        party: {
          title: "Party Collection",
          subtitle:
            "Eine Sammlung rhythmischer und mitreißender Songs für Feiern, Empfänge und energiegeladene Events.",
          iframeTitle: "SoundCloud-Player für Party Collection",
          externalAriaLabel: "Party Collection auf SoundCloud in einem neuen Tab anhören",
        },
        timeless: {
          title: "Timeless Classics Collection",
          subtitle:
            "Große italienische und internationale Klassiker, die Generationen weiterhin berühren.",
          iframeTitle: "SoundCloud-Player für Timeless Classics Collection",
          externalAriaLabel: "Timeless Classics Collection auf SoundCloud in einem neuen Tab anhören",
        },
      },
      externalLinkText: "Auf SoundCloud anhören",
      showAll: "Alle Audios anzeigen",
      showLess: "Weniger Audios anzeigen",
      tracklistButton: "Trackliste des Mix anzeigen",
      tracklistHide: "Trackliste ausblenden",
      tracklistExport: "Trackliste exportieren",
      tracklistHeading: "Trackliste",
      tracklistClose: "Schließen",
    },
    contacts: {
      kicker: "Kontakt",
      title: "Live-Musik für Hotels, Veranstaltungen und besondere Abende",
      subtitle: "Sprechen wir über Ihre Veranstaltung",
      description:
        "Füllen Sie das Formular aus. Wir melden uns zeitnah mit einem passenden Vorschlag.",
      fields: {
        fullName: "Vor- und Nachname",
        email: "E-Mail",
        eventType: "Art der Veranstaltung",
        eventDate: "Veranstaltungsdatum",
        location: "Ort",
        message: "Nachricht",
        consent: "Ich stimme der Verarbeitung meiner personenbezogenen Daten zur Kontaktaufnahme zu.",
      },
      eventTypes: {
        hotel: "Hotel",
        wedding: "Hochzeit",
        private_party: "Private Feier",
        corporate: "Firmenveranstaltung",
        other: "Sonstiges",
      },
      placeholders: {
        fullName: "z. B. Max Mustermann",
        email: "name@beispiel.de",
        location: "z. B. Berlin",
        message: "Nennen Sie bitte Datum, Zeiten und gewünschte Atmosphäre...",
      },
      submit: "Anfrage senden",
      sending: "Wird gesendet...",
      success: "Nachricht erfolgreich gesendet. Wir melden uns in Kürze.",
      error: "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es in wenigen Minuten erneut.",
      validation: {
        fullName: "Bitte Vor- und Nachname eingeben (mindestens 2 Zeichen).",
        email: "Bitte eine gültige E-Mail-Adresse eingeben.",
        eventType: "Bitte eine Veranstaltungsart auswählen.",
        message: "Bitte eine Nachricht mit mindestens 10 Zeichen eingeben.",
        consent: "Sie müssen der Datenverarbeitung zustimmen, um die Anfrage zu senden.",
      },
    },
    changeLanguage: "Sprache ändern",
  },

  ru: {
    languageName: "Русский",
    enterTitle: "Выберите язык",
    enterSubtitle: "Музыка, которая дарит эмоции",
    nav: {
      home: "Главная",
      about: "О нас",
      audio: "Аудио",
      repertoire: "Репертуар",
      gallery: "Галерея",
      video: "Видео",
      contacts: "Контакты",
    },
    hero: {
      eyebrow: "Добро пожаловать в нашу музыку",
      subtitle: "Музыка для незабываемых моментов",
      scroll: "Открыть",
    },
    about: {
      kicker: "НАША ИСТОРИЯ",
      title: "рассказанная через музыку",
      intro:
        "Каждый вечер - это встреча. Каждая песня рассказывает об эмоции.",
      paragraphOne:
        "Для нас музыка - это не просто профессия: это самый искренний способ общаться, трогать сердца и создавать воспоминания, которые остаются с людьми надолго. Ciro & Dino Live Music родился из встречи двух творческих путей, объединенных одной страстью: нести на сцену элегантность, музыкальное качество и искренний контакт с публикой. С помощью клавишных, гитары и вокала мы создаем живые выступления, которые естественно адаптируются к атмосфере каждого события.",
      paragraphTwo:
        "Около тридцати лет мы постоянно сопровождаем музыкальные вечера исторического Circolo dei Forestieri в Сорренто, выступая перед гостями со всего мира. Этот длительный опыт научил нас тому, что каждая аудитория уникальна и что каждое событие требует чуткости, умения слушать и способности выбрать правильную музыку в правильный момент. Наш репертуар охватывает более шестидесяти лет великих хитов: от лучших итальянских и неаполитанских мелодий до международных стандартов, а также крупных классиков pop, rock, soul, dance и latin, которые продолжают трогать разные поколения.",
      paragraphThree:
        "Будь то элегантный ужин, прием, частный праздник или вечер танцев, каждое выступление мы строим с одной целью: создать вовлекающую, изысканную атмосферу и оставить особенное воспоминание. За эти годы мы поняли, что ценность живой музыки измеряется не только качеством исполнения, но и способностью превратить обычный вечер в событие, которое хочется помнить. С этим настроем мы выходим на сцену каждый раз.",
      pointExperience: "Более тридцати лет опыта в живой музыке.",
      pointRepertoire:
        "Итальянский, неаполитанский и международный репертуар, который постоянно обновляется.",
      pointTailored:
        "Индивидуальные выступления для приемов, эксклюзивных мероприятий и частных праздников.",
    },
    liveVenue: {
      kicker: "ГДЕ НАС СЛУШАТЬ ВЖИВУЮ",
      title: "Наш музыкальный дом в Сорренто",
      paragraphOne:
        "Около тридцати лет, без перерывов, Ciro & Dino сопровождают своей музыкой вечера Circolo dei Forestieri – Terrazza delle Sirene, одного из самых впечатляющих мест в самом сердце Сорренто.",
      paragraphTwo:
        "Со временем эта престижная терраса стала нашим музыкальным домом: местом встречи элегантности, панорамы и живой музыки, где каждое выступление рождается из прямого контакта с публикой.",
      highlight:
        "Около тридцати лет живой музыки на одной и той же престижной площадке.",
      venueName: "Circolo dei Forestieri – Terrazza delle Sirene",
      addressLine1: "Via Luigi de Maio, 35",
      addressLine2: "Sorrento",
      addressLine3: "Città Metropolitana di Napoli",
      addressLine4: "Italia",
      directions: "Маршрут",
      directionsAriaLabel:
        "Открыть маршрут к Circolo dei Forestieri – Terrazza delle Sirene в Google Maps (новая вкладка)",
      venueContactsTitle: "Контакты площадки",
      venueEmailLabel: "E-mail площадки: info@circolodeiforestieri.com",
      venuePhoneLabel: "Телефон площадки: +39 081 877 3263",
      artisticNotePrefix:
        "По вопросам выступлений, доступности и частных мероприятий воспользуйтесь",
      artisticNoteLinkLabel: "формой контактов",
      artisticNoteSuffix: "Ciro & Dino Live Music.",
    },
    repertoire: {
      kicker: "Наш репертуар",
      title: "От традиции к международному звучанию",
      description:
        "Итальянская и неаполитанская музыка, международные стандарты, pop, rock, soul, dance и latin: каждое выступление адаптируется под атмосферу, публику и формат события.",
      closing:
        "Каждый вечер рождается из встречи с публикой. Поэтому наш репертуар никогда не бывает жестким: он подстраивается под атмосферу, гостей и тип мероприятия, сочетая итальянскую и неаполитанскую музыку, международные стандарты, pop, rock, soul, dance и latin-звучание.",
      categories: {
        italian: {
          title: "Итальянская музыка",
          description: "Вневременные мелодии и великие хиты, близкие слушателям разных поколений.",
        },
        neapolitan: {
          title: "Неаполитанская классика",
          description: "Песни неаполитанской традиции в теплой, элегантной и естественной интерпретации.",
        },
        international: {
          title: "Международные стандарты",
          description: "Международная подборка, созданная для сопровождения изысканной атмосферы со стилем.",
        },
        pop: {
          title: "Pop",
          description: "Узнаваемые и универсальные композиции для открытой и вовлекающей атмосферы.",
        },
        rock: {
          title: "Rock",
          description: "Тщательно выбранная классика с характером и энергией, всегда в гармонии с моментом.",
        },
        soul: {
          title: "Soul",
          description: "Теплые и изысканные тембры, добавляющие глубину, ритм и эмоциональную интенсивность.",
        },
        dance: {
          title: "Dance",
          description: "Динамичные композиции, которые поднимают энергию, когда этого требует вечер.",
        },
        latin: {
          title: "Latin",
          description: "Latin-ритмы и оттенки, которые придают музыкальному пути тепло, плавность и разнообразие.",
        },
      },
    },
    gallery: {
      kicker: "ЖИВЫЕ МОМЕНТЫ",
      title: "Моменты, в которых звучит наша музыка",
      intro:
        "Каждый кадр сохраняет атмосферу вечера, встречу с публикой и эмоцию живой музыки. Визуальное путешествие по настоящему и истории Ciro & Dino Live Music.",
      contemporaryTitle: "Музыка сегодня",
      contemporaryText:
        "Среди инструментов, голосов и панорам каждое выступление рождается из прямой связи с публикой и уникальной атмосферы каждой ночи.",
      historyKicker: "НАШ ПУТЬ",
      historyTitle: "Более тридцати лет музыки вместе",
      historyText:
        "Фотографии меняются, инструменты эволюционируют, но страсть остается прежней. Музыкальное путешествие, начавшееся более тридцати лет назад и продолжающееся без перерывов до сегодняшнего дня.",
      historyCaptions: {
        firstYears: "Начало нашего музыкального пути",
        fredBongusto: "Особенная встреча с Фредом Бонгусто",
        povia: "С Повией, объединенные любовью к музыке",
      },
      historyItemAlts: {
        firstYears: "Ciro и Dino во время одного из первых выступлений их музыкального пути.",
        fredBongusto: "Ciro и Dino вместе с Фредом Бонгусто на фотографии из их творческой истории.",
        povia: "Ciro и Dino вместе с Повией во время встречи, связанной с музыкой.",
      },
      imageAlts: {
        hero: "Ciro и Dino во время музыкального выступления на закате.",
        ciroPortrait: "Ciro с гитарой на фоне побережья.",
        dinoPortrait: "Dino за фортепиано на фоне побережья.",
        livePanorama: "Ciro и Dino во время живого выступления на террасе.",
        liveSunset: "Ciro и Dino во время выступления на закате.",
        historyGuitar: "Ciro и Dino на фотографии первых лет своего пути.",
        historyPortrait: "Ciro и Dino вместе с гитарой на исторической фотографии.",
        historyLive: "Ciro и Dino во время одного из первых живых выступлений.",
      },
      openImageAriaLabel: "Открыть изображение в большом формате",
      dialogLabel: "Фотогалерея Ciro & Dino Live Music",
      closeLabel: "Закрыть галерею",
      previousLabel: "Предыдущее изображение",
      nextLabel: "Следующее изображение",
    },
    video: {
      kicker: "Живое выступление",
      title: "Наша музыка вживую",
      description:
        "Здесь мы публикуем подборку видео, показывающих энергию, элегантность и контакт с публикой во время наших выступлений.",
      collections: {
        ymca: {
          subtitle: "Энергичная и сразу узнаваемая композиция, идеально передающая импульс и вовлеченность.",
          iframeTitle: "Видео YouTube: YMCA",
          externalAriaLabel: "Смотреть YMCA на YouTube в новой вкладке",
        },
        figliDelleStelle: {
          subtitle: "Элегантная классика, в которой сочетаются атмосфера и непосредственность.",
          iframeTitle: "Видео YouTube: Figli delle Stelle",
          externalAriaLabel: "Смотреть Figli delle Stelle на YouTube в новой вкладке",
        },
        staserachesera: {
          subtitle: "Большая итальянская композиция, придающая ритм и чувство общей памяти.",
          iframeTitle: "Видео YouTube: Stasera che sera",
          externalAriaLabel: "Смотреть Stasera che sera на YouTube в новой вкладке",
        },
        rossettoECaffe: {
          title: "Губная помада и кофе",
          subtitle: "Губная помада и кофе",
          iframeTitle: "Видео YouTube: Губная помада и кофе",
          externalAriaLabel: "Смотреть Губная помада и кофе на YouTube в новой вкладке",
        },
        circoloForestieriShorts: {
          title: "Ciro & Dino в Circolo dei Forestieri",
          subtitle: "Ciro & Dino в Circolo dei Forestieri",
          iframeTitle: "YouTube Shorts: Ciro & Dino в Circolo dei Forestieri",
          externalAriaLabel: "Смотреть Ciro & Dino в Circolo dei Forestieri на YouTube в новой вкладке",
        },
        somewhereOverTheRainbow: {
          title: "Somewhere Over The Rainbow",
          subtitle: "Вневременная мелодия с камерным и элегантным настроением.",
          iframeTitle: "YouTube Shorts: Somewhere Over The Rainbow",
          externalAriaLabel: "Смотреть Somewhere Over The Rainbow на YouTube в новой вкладке",
        },
        unforgettable: {
          title: "Unforgettable",
          subtitle: "Изысканная классика, идеально подходящая для романтичной атмосферы.",
          iframeTitle: "Видео YouTube: Unforgettable",
          externalAriaLabel: "Смотреть Unforgettable на YouTube в новой вкладке",
        },
        oiMari: {
          title: "Oi Marì",
          subtitle: "Средиземноморское тепло и традиция в увлекательном исполнении.",
          iframeTitle: "Видео YouTube: Oi Marì",
          externalAriaLabel: "Смотреть Oi Marì на YouTube в новой вкладке",
        },
        stopBajon: {
          title: "Stop Bajon",
          subtitle: "Ритм и лёгкость для праздничного настроения.",
          iframeTitle: "Видео YouTube: Stop Bajon",
          externalAriaLabel: "Смотреть Stop Bajon на YouTube в новой вкладке",
        },
        stayingAlive: {
          title: "Staying Alive",
          subtitle: "Мгновенная dance-энергия, которая оживляет вечер.",
          iframeTitle: "YouTube Shorts: Staying Alive",
          externalAriaLabel: "Смотреть Staying Alive на YouTube в новой вкладке",
        },
        quandoQuando: {
          title: "Quando Quando",
          subtitle: "Quando Quando",
          iframeTitle: "Видео YouTube: Quando Quando",
          externalAriaLabel: "Смотреть Quando Quando на YouTube в новой вкладке",
        },
        perUnOraDAmore: {
          title: "Per un'ora d'amore",
          subtitle: "Per un'ora d'amore",
          iframeTitle: "Видео YouTube: Per un'ora d'amore",
          externalAriaLabel: "Смотреть Per un'ora d'amore на YouTube в новой вкладке",
        },
        thisMasquerade: {
          title: "This Masquerade",
          subtitle: "This Masquerade",
          iframeTitle: "Видео YouTube: This Masquerade",
          externalAriaLabel: "Смотреть This Masquerade на YouTube в новой вкладке",
        },
        quellaCarezzaDellaSera: {
          title: "Quella carezza della sera",
          subtitle: "Quella carezza della sera",
          iframeTitle: "Видео YouTube: Quella carezza della sera",
          externalAriaLabel: "Смотреть Quella carezza della sera на YouTube в новой вкладке",
        },
        ilCieloInUnaStanza: {
          title: "Il cielo in una stanza",
          subtitle: "Il cielo in una stanza",
          iframeTitle: "YouTube Shorts: Il cielo in una stanza",
          externalAriaLabel: "Смотреть Il cielo in una stanza на YouTube в новой вкладке",
        },
        guardaCheLuna: {
          title: "Guarda che luna",
          subtitle: "Guarda che luna",
          iframeTitle: "YouTube Shorts: Guarda che luna",
          externalAriaLabel: "Смотреть Guarda che luna на YouTube в новой вкладке",
        },
        georgiaOnMyMind: {
          title: "Georgia on my mind",
          subtitle: "Georgia on my mind",
          iframeTitle: "YouTube Shorts: Georgia on my mind",
          externalAriaLabel: "Смотреть Georgia on my mind на YouTube в новой вкладке",
        },
        volare: {
          title: "Volare",
          subtitle: "Volare",
          iframeTitle: "YouTube Shorts: Volare",
          externalAriaLabel: "Смотреть Volare на YouTube в новой вкладке",
        },
        ePensoATe: {
          title: "E penso a te",
          subtitle: "E penso a te",
          iframeTitle: "Видео YouTube: E penso a te",
          externalAriaLabel: "Смотреть E penso a te на YouTube в новой вкладке",
        },
        mamboItaliano: {
          title: "Mambo Italiano",
          subtitle: "Mambo Italiano",
          iframeTitle: "YouTube Shorts: Mambo Italiano",
          externalAriaLabel: "Смотреть Mambo Italiano на YouTube в новой вкладке",
        },
      },
      externalLinkText: "Смотреть на YouTube",
      youtubeCta: {
        title: "Откройте все наши видео",
        text: "На нашем YouTube-канале вас ждут новые live-выступления, свежие видео и все обновления.",
        button: "Перейти на наш YouTube-канал",
      },
    },
    audio: {
      kicker: "АУДИО",
      title: "Слушайте нашу музыку",
      description:
        "Три коллекции, отражающие разные грани нашего репертуара: эмоцию, энергию и вневременную классику.",
      collections: {
        love: {
          title: "Love Collection",
          subtitle:
            "Подборка романтичных и мелодичных композиций для самых эмоциональных моментов.",
          iframeTitle: "Плеер SoundCloud для Love Collection",
          externalAriaLabel: "Слушать Love Collection на SoundCloud в новой вкладке",
        },
        party: {
          title: "Party Collection",
          subtitle:
            "Подборка ритмичных и захватывающих треков для вечеринок, приемов и энергичных мероприятий.",
          iframeTitle: "Плеер SoundCloud для Party Collection",
          externalAriaLabel: "Слушать Party Collection на SoundCloud в новой вкладке",
        },
        timeless: {
          title: "Timeless Classics Collection",
          subtitle:
            "Великие итальянские и международные классические песни, которые продолжают трогать поколения.",
          iframeTitle: "Плеер SoundCloud для Timeless Classics Collection",
          externalAriaLabel: "Слушать Timeless Classics Collection на SoundCloud в новой вкладке",
        },
      },
      externalLinkText: "Слушать на SoundCloud",
      showAll: "Показать все аудио",
      showLess: "Показать меньше аудио",
      tracklistButton: "Посмотреть список треков микса",
      tracklistHide: "Скрыть список треков",
      tracklistExport: "Экспортировать список треков",
      tracklistHeading: "Список треков",
      tracklistClose: "Закрыть",
    },
    contacts: {
      kicker: "Контакты",
      title: "Живая музыка для отелей, мероприятий и особых вечеров",
      subtitle: "Давайте обсудим ваше мероприятие",
      description:
        "Заполните форму, и мы вскоре ответим вам персональным предложением.",
      fields: {
        fullName: "Имя и фамилия",
        email: "E-mail",
        eventType: "Тип мероприятия",
        eventDate: "Дата мероприятия",
        location: "Место проведения",
        message: "Сообщение",
        consent: "Я согласен(на) на обработку моих персональных данных для обратной связи.",
      },
      eventTypes: {
        hotel: "Отель",
        wedding: "Свадьба",
        private_party: "Частная вечеринка",
        corporate: "Корпоративное мероприятие",
        other: "Другое",
      },
      placeholders: {
        fullName: "Напр. Иван Иванов",
        email: "name@example.com",
        location: "Напр. Москва",
        message: "Расскажите нам дату, время и желаемую атмосферу...",
      },
      submit: "Отправить запрос",
      sending: "Отправка...",
      success: "Сообщение успешно отправлено. Мы скоро с вами свяжемся.",
      error: "При отправке произошла ошибка. Пожалуйста, попробуйте снова через несколько минут.",
      validation: {
        fullName: "Введите имя и фамилию (не менее 2 символов).",
        email: "Введите корректный адрес электронной почты.",
        eventType: "Выберите тип мероприятия.",
        message: "Введите сообщение длиной не менее 10 символов.",
        consent: "Для отправки запроса необходимо согласие на обработку данных.",
      },
    },
    changeLanguage: "Сменить язык",
  },
};

function getSavedLanguage(): LanguageCode | null {
  if (typeof window === "undefined") {
    return null;
  }

  const savedLanguage = localStorage.getItem("dino-ciro-language");

  if (savedLanguage && savedLanguage in translations) {
    return savedLanguage as LanguageCode;
  }

  return null;
}

export default function Home() {
  const [language, setLanguage] = useState<LanguageCode>(() => getSavedLanguage() ?? "it");
  const [languageSelected, setLanguageSelected] = useState(() => getSavedLanguage() !== null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteReady, setSiteReady] = useState(false);
  const [introClosing, setIntroClosing] = useState(false);
  const [contactFormData, setContactFormData] =
    useState<ContactFormData>(initialContactFormData);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"fullName" | "email" | "eventType" | "message" | "consent", string>>
  >({});
  const [minEventDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [showAllAudio, setShowAllAudio] = useState(false);
  const [openTracklistId, setOpenTracklistId] = useState<string | null>(null);
  const audioSectionRef = useRef<HTMLElement>(null);
  const text = translations[language];
  const percorsoAltByLanguage: Record<LanguageCode, string[]> = {
    it: [
      "Ciro & Dino durante una delle prime esibizioni dal vivo",
      "Ciro & Dino durante una serata musicale con ospiti",
      "Ciro & Dino in un momento informale durante una serata",
      "Ciro & Dino durante una storica esibizione dal vivo",
      "Ciro & Dino durante una serata affollata con il pubblico",
      "Ciro & Dino durante un'esibizione musicale al pianoforte",
      "Ciro & Dino in una fotografia storica del loro percorso musicale",
    ],
    en: [
      "Ciro & Dino during one of their earliest live performances",
      "Ciro & Dino during a musical evening with guests",
      "Ciro & Dino in an informal moment during an evening performance",
      "Ciro & Dino during a historic live performance",
      "Ciro & Dino during a crowded evening with the audience",
      "Ciro & Dino during a piano performance",
      "Ciro & Dino in a historic photograph from their musical journey",
    ],
    fr: [
      "Ciro & Dino lors de l'une de leurs premières prestations en direct",
      "Ciro & Dino lors d'une soirée musicale avec des invités",
      "Ciro & Dino dans un moment informel au cours d'une soirée",
      "Ciro & Dino lors d'une prestation historique en direct",
      "Ciro & Dino lors d'une soirée très fréquentée avec le public",
      "Ciro & Dino lors d'une prestation musicale au piano",
      "Ciro & Dino sur une photographie historique de leur parcours musical",
    ],
    es: [
      "Ciro & Dino durante una de sus primeras actuaciones en vivo",
      "Ciro & Dino durante una velada musical con invitados",
      "Ciro & Dino en un momento informal durante una velada",
      "Ciro & Dino durante una histórica actuación en vivo",
      "Ciro & Dino durante una velada concurrida con el público",
      "Ciro & Dino durante una actuación musical al piano",
      "Ciro & Dino en una fotografía histórica de su trayectoria musical",
    ],
    de: [
      "Ciro & Dino bei einem ihrer ersten Live-Auftritte",
      "Ciro & Dino bei einem musikalischen Abend mit Gästen",
      "Ciro & Dino in einem informellen Moment während eines Abends",
      "Ciro & Dino bei einem historischen Live-Auftritt",
      "Ciro & Dino bei einem gut besuchten Abend mit Publikum",
      "Ciro & Dino bei einem musikalischen Auftritt am Klavier",
      "Ciro & Dino auf einem historischen Foto ihres musikalischen Weges",
    ],
    ru: [
      "Ciro & Dino во время одного из своих ранних живых выступлений",
      "Ciro & Dino во время музыкального вечера с гостями",
      "Ciro & Dino в неформальный момент во время вечера",
      "Ciro & Dino во время исторического живого выступления",
      "Ciro & Dino во время многолюдного вечера с публикой",
      "Ciro & Dino во время музыкального выступления за фортепиано",
      "Ciro & Dino на исторической фотографии их музыкального пути",
    ],
  };
  const percorsoImages = [
    { id: "percorso-01", src: "/images/Percorso/percorso-01.webp", width: 555, height: 499 },
    { id: "percorso-02", src: "/images/Percorso/percorso-02.webp", width: 732, height: 495 },
    { id: "percorso-03", src: "/images/Percorso/percorso-03.webp", width: 547, height: 502 },
    { id: "percorso-04", src: "/images/Percorso/percorso-04.webp", width: 427, height: 549 },
    { id: "percorso-05", src: "/images/Percorso/percorso-05.webp", width: 559, height: 517 },
    { id: "percorso-06", src: "/images/Percorso/percorso-06.webp", width: 717, height: 495 },
    { id: "percorso-07", src: "/images/Percorso/percorso-07.webp", width: 492, height: 412 },
  ];
  const percorsoItems = percorsoImages.map((item, index) => ({
    id: `gallery-${12 + index}-${item.id}`,
    src: item.src,
    alt: percorsoAltByLanguage[language][index],
    variant: "history-natural" as const,
    width: item.width,
    height: item.height,
    openLabel: `${text.gallery.openImageAriaLabel}: ${percorsoAltByLanguage[language][index]}`,
  }));
  const galleryItems = [
    {
      id: "gallery-01-momenti-dal-vivo-01",
      src: "/images/Live/momenti-dal-vivo-02.webp",
      alt: text.gallery.imageAlts.livePanorama,
      variant: "hero" as const,
      priority: true,
      openLabel: `${text.gallery.openImageAriaLabel}: ${text.gallery.imageAlts.livePanorama}`,
    },
    {
      id: "gallery-03-dino-portrait",
      src: "/gallery/gallery-03-dino-portrait-v2.webp",
      alt: text.gallery.imageAlts.dinoPortrait,
      variant: "portrait" as const,
      openLabel: `${text.gallery.openImageAriaLabel}: ${text.gallery.imageAlts.dinoPortrait}`,
    },
    {
      id: "gallery-02-ciro-portrait",
      src: "/gallery/gallery-02-ciro-portrait-v3.webp",
      alt: text.gallery.imageAlts.ciroPortrait,
      variant: "portrait" as const,
      openLabel: `${text.gallery.openImageAriaLabel}: ${text.gallery.imageAlts.ciroPortrait}`,
    },
    {
      id: "gallery-04-duo-live-panorama",
      src: "/gallery/gallery-04-duo-live-panorama-v3.webp",
      alt: text.gallery.imageAlts.livePanorama,
      variant: "live-large" as const,
      openLabel: `${text.gallery.openImageAriaLabel}: ${text.gallery.imageAlts.livePanorama}`,
    },
    {
      id: "gallery-05-duo-live-sunset",
      src: "/gallery/gallery-05-duo-live-sunset_v1.webp",
      alt: text.gallery.imageAlts.liveSunset,
      variant: "live" as const,
      openLabel: `${text.gallery.openImageAriaLabel}: ${text.gallery.imageAlts.liveSunset}`,
    },
    {
      id: "gallery-06-history-duo-guitar",
      src: "/gallery/gallery-06-history-duo-guitar.webp",
      alt: text.gallery.imageAlts.historyGuitar,
      variant: "history-natural" as const,
      width: 1600,
      height: 1080,
      openLabel: `${text.gallery.openImageAriaLabel}: ${text.gallery.imageAlts.historyGuitar}`,
    },
    {
      id: "gallery-07-history-duo-portrait",
      src: "/gallery/gallery-07-history-duo-portrait.webp",
      alt: text.gallery.imageAlts.historyPortrait,
      variant: "history-natural" as const,
      width: 1600,
      height: 1135,
      openLabel: `${text.gallery.openImageAriaLabel}: ${text.gallery.imageAlts.historyPortrait}`,
    },
    {
      id: "gallery-08-history-live",
      src: "/gallery/gallery-08-history-live.webp",
      alt: text.gallery.imageAlts.historyLive,
      variant: "history-natural" as const,
      width: 1600,
      height: 1080,
      openLabel: `${text.gallery.openImageAriaLabel}: ${text.gallery.imageAlts.historyLive}`,
    },
    {
      id: "gallery-09-first-years",
      src: "/gallery/gallery-09-first-years.webp",
      alt: text.gallery.historyItemAlts.firstYears,
      variant: "history-natural" as const,
      width: 1600,
      height: 1200,
      caption: text.gallery.historyCaptions.firstYears,
      openLabel: `${text.gallery.openImageAriaLabel}: ${text.gallery.historyItemAlts.firstYears}`,
    },
    {
      id: "gallery-10-fred-bongusto",
      src: "/gallery/gallery-10-fred-bongusto.webp",
      alt: text.gallery.historyItemAlts.fredBongusto,
      variant: "history-natural" as const,
      width: 363,
      height: 348,
      caption: text.gallery.historyCaptions.fredBongusto,
      openLabel: `${text.gallery.openImageAriaLabel}: ${text.gallery.historyItemAlts.fredBongusto}`,
    },
    {
      id: "gallery-11-povia",
      src: "/gallery/gallery-11-povia.webp",
      alt: text.gallery.historyItemAlts.povia,
      variant: "history-natural" as const,
      width: 367,
      height: 243,
      caption: text.gallery.historyCaptions.povia,
      openLabel: `${text.gallery.openImageAriaLabel}: ${text.gallery.historyItemAlts.povia}`,
    },
    ...percorsoItems,
  ];
  const audioCollections = [
    {
      id: "timeless-classics-collection",
      title: text.audio.collections.timeless.title,
      subtitle: text.audio.collections.timeless.subtitle,
      iframeTitle: text.audio.collections.timeless.iframeTitle,
      externalAriaLabel:
        text.audio.collections.timeless.externalAriaLabel,
      externalUrl:
        "https://soundcloud.com/ciro-dino-live-music/timeless-classics-collection",
      tracklist: audioTracklists["timeless-classics-collection"],
    },
    {
      id: "party-collection",
      title: text.audio.collections.party.title,
      subtitle: text.audio.collections.party.subtitle,
      iframeTitle: text.audio.collections.party.iframeTitle,
      externalAriaLabel:
        text.audio.collections.party.externalAriaLabel,
      externalUrl:
        "https://soundcloud.com/ciro-dino-live-music/party-collection-dance-party",
      tracklist: audioTracklists["party-collection"],
    },
    {
      id: "love-collection",
      title: text.audio.collections.love.title,
      subtitle: text.audio.collections.love.subtitle,
      iframeTitle: text.audio.collections.love.iframeTitle,
      externalAriaLabel:
        text.audio.collections.love.externalAriaLabel,
      externalUrl:
        "https://soundcloud.com/ciro-dino-live-music/love-collection-romantic-songs",
      tracklist: audioTracklists["love-collection"],
    },
  ];
  const currentLanguage = languages.find((item) => item.code === language);
  const statusMessage =
    formStatus === "success"
      ? text.contacts.success
      : formStatus === "error"
        ? text.contacts.error
        : "";

  useEffect(() => {
    const readyTimeout = window.setTimeout(() => {
      setSiteReady(true);
    }, 0);

    return () => window.clearTimeout(readyTimeout);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setLanguageMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  useEffect(() => {
    function closeMobileOnDesktopWidth() {
      if (window.innerWidth > 850) {
        setMobileMenuOpen(false);
      }
    }

    function closeMobileOnOrientationChange() {
      setMobileMenuOpen(false);
    }

    window.addEventListener("resize", closeMobileOnDesktopWidth);
    window.addEventListener("orientationchange", closeMobileOnOrientationChange);
    closeMobileOnDesktopWidth();

    return () => {
      window.removeEventListener("resize", closeMobileOnDesktopWidth);
      window.removeEventListener("orientationchange", closeMobileOnOrientationChange);
    };
  }, []);

  function toggleMobileMenu() {
    setMobileMenuOpen((open) => {
      const nextOpen = !open;

      if (nextOpen) {
        setLanguageMenuOpen(false);
      }

      return nextOpen;
    });
  }

  function toggleLanguageMenu() {
    setLanguageMenuOpen((open) => {
      const nextOpen = !open;

      if (nextOpen) {
        setMobileMenuOpen(false);
      }

      return nextOpen;
    });
  }

  function selectLanguage(code: LanguageCode) {
    if (introClosing) {
      return;
    }

    setMobileMenuOpen(false);
    setLanguage(code);
    setLanguageMenuOpen(false);
    setIntroClosing(true);

    localStorage.setItem("dino-ciro-language", code);

    window.setTimeout(() => {
      setLanguageSelected(true);
      setIntroClosing(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 750);
  }

  function reopenLanguageSelector() {
    setMobileMenuOpen(false);
    setLanguageMenuOpen(false);
    setIntroClosing(false);
    setLanguageSelected(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function updateContactField<K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K],
  ) {
    setContactFormData((prev) => ({ ...prev, [key]: value }));

    if (fieldErrors[key as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    }

    if (formStatus !== "idle") {
      setFormStatus("idle");
    }
  }

  function validateContactForm() {
    const errors: Partial<
      Record<"fullName" | "email" | "eventType" | "message" | "consent", string>
    > = {};

    const normalizedName = contactFormData.fullName.trim();
    const normalizedEmail = contactFormData.email.trim();
    const normalizedMessage = contactFormData.message.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (normalizedName.length < 2) {
      errors.fullName = text.contacts.validation.fullName;
    }

    if (!emailPattern.test(normalizedEmail)) {
      errors.email = text.contacts.validation.email;
    }

    if (!contactFormData.eventType || !eventTypeValues.includes(contactFormData.eventType)) {
      errors.eventType = text.contacts.validation.eventType;
    }

    if (normalizedMessage.length < 10) {
      errors.message = text.contacts.validation.message;
    }

    if (!contactFormData.consent) {
      errors.consent = text.contacts.validation.consent;
    }

    return errors;
  }

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formStatus === "sending") {
      return;
    }

    const errors = validateContactForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormStatus("error");
      return;
    }

    setFormStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactFormData),
      });

      if (!response.ok) {
        setFormStatus("error");
        return;
      }

      setContactFormData(initialContactFormData);
      setFieldErrors({});
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  }

  if (!siteReady) {
    return <div className="site-loading" />;
  }

  return (
    <MediaPlaybackProvider>
    <main>
      {!languageSelected && (
		<section
		  className={
			introClosing
			  ? "language-intro language-intro-closing"
			  : "language-intro"
		  }
		>
          <div className="language-intro-image">
            <Image
              src="/images/hero.jpg"
              alt="Ciro e Dino Live Music"
              fill
              priority
              sizes="100vw"
            />
          </div>

          <div className="language-intro-overlay" />
          <div className="intro-light intro-light-one" />
          <div className="intro-light intro-light-two" />

          <div className="language-intro-content">
            <p className="intro-welcome">
              {translations.it.enterSubtitle}
            </p>

            <h1>
              Ciro <span>&amp;</span> Dino
            </h1>

            <p className="intro-live-music">Live Music</p>

            <div className="intro-gold-line" />

            <h2>{translations.it.enterTitle}</h2>

			<div className="intro-languages">
			  {languages.map((item, index) => (
				<button
				  type="button"
				  key={item.code}
				  disabled={introClosing}
				  onClick={() => selectLanguage(item.code)}
				  title={item.label}
				  aria-label={item.label}
				  style={{
					animationDelay: `${760 + index * 120}ms`,
				  }}
				>
				  <span className="intro-flag" aria-hidden="true">
					<Image
					  src={item.flag}
					  alt=""
					  width={34}
					  height={23}
					/>
				  </span>

				  <span className="intro-language-name">
					{item.label}
				  </span>
				</button>
			  ))}
			</div>
          </div>
        </section>
      )}

      <div
        className={
          languageSelected
            ? "website website-visible"
            : "website website-hidden"
        }
      >
        <section className="hero" id="home">
          <div className="hero-image">
            <Image
              src="/images/hero.jpg"
              alt="Ciro e Dino Live Music"
              fill
              priority
              sizes="100vw"
            />
          </div>

          <div className="hero-overlay" />
          <div className="cinematic-glow" />

          <nav className="navbar" aria-label="Navigazione principale">
            <a className="navbar-brand" href="#home">
              <span>Ciro &amp; Dino</span>
              <small>Live Music</small>
            </a>

            <button
              type="button"
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="main-navigation-links"
              aria-label={mobileMenuOpen ? "Chiudi menu" : "Apri menu"}
            >
              <span aria-hidden="true">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>

            <div
              id="main-navigation-links"
              className={`navbar-links ${mobileMenuOpen ? "navbar-links-open" : ""}`}
            >
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>
                {text.nav.about}
              </a>
              <a href="#repertoire" onClick={() => setMobileMenuOpen(false)}>
                {text.nav.repertoire}
              </a>
              <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>
                {text.nav.gallery}
              </a>
              <a href="#video" onClick={() => setMobileMenuOpen(false)}>
                {text.nav.video}
              </a>
              <a href="#audio" onClick={() => setMobileMenuOpen(false)}>
                {text.nav.audio}
              </a>
              <a href="#contacts" onClick={() => setMobileMenuOpen(false)}>
                {text.nav.contacts}
              </a>
            </div>
            <div className="language-menu">
              <button
                type="button"
                className="current-language"
                onClick={toggleLanguageMenu}
                aria-expanded={languageMenuOpen}
                aria-label={text.changeLanguage}
                title={text.changeLanguage}
              >				
				{currentLanguage && (
				  <Image
					src={currentLanguage.flag}
					alt=""
					width={23}
					height={15}
					aria-hidden="true"
				  />
				)}
                <small>{language.toUpperCase()}</small>
              </button>

              {languageMenuOpen && (
                <div className="language-dropdown">
                  {languages.map((item) => (
                    <button
                      type="button"
                      key={item.code}
                      className={
                        item.code === language ? "active-language" : ""
                      }
                      onClick={() => selectLanguage(item.code)}
                    >
  					  <Image
					    src={item.flag}
					    alt=""
					    width={25}
					    height={17}
					    aria-hidden="true"
					  />
					  {item.label}					  
                    </button>
                  ))}

                  <button
                    type="button"
                    className="language-reset"
                    onClick={reopenLanguageSelector}
                  >
                    {text.changeLanguage}
                  </button>
                </div>
              )}
            </div>
          </nav>

          <div className="hero-content">
            <p className="hero-eyebrow">{text.hero.eyebrow}</p>

            <h1>
              <span>Ciro &amp; Dino</span>
              <strong>Live Music</strong>
            </h1>

            <div className="gold-line" />

            <p className="hero-subtitle">{text.hero.subtitle}</p>
          </div>

          <a
            className="scroll-indicator"
            href="#about"
            aria-label={text.hero.scroll}
          >
            <span>{text.hero.scroll}</span>
            <i />
          </a>
        </section>

        <section className="intro-section" id="about" aria-labelledby="about-title">
          <div className="intro-section-inner">
            <p className="section-kicker">{text.about.kicker}</p>
            <h2 id="about-title">{text.about.title}</h2>
            <p className="about-intro">{text.about.intro}</p>

            <div className="about-copy">
              <p>{text.about.paragraphOne}</p>
              <p>{text.about.paragraphTwo}</p>
              <p>{text.about.paragraphThree}</p>
            </div>

            <div className="about-highlights" aria-label={text.about.title}>
              <article>
                <span aria-hidden="true" className="about-highlight-mark" />
                <p>{text.about.pointExperience}</p>
              </article>

              <article>
                <span aria-hidden="true" className="about-highlight-mark" />
                <p>{text.about.pointRepertoire}</p>
              </article>

              <article>
                <span aria-hidden="true" className="about-highlight-mark" />
                <p>{text.about.pointTailored}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="live-venue-section" id="live-venue" aria-labelledby="live-venue-title">
          <div className="live-venue-inner">
            <div className="live-venue-main">
              <p className="section-kicker">{text.liveVenue.kicker}</p>
              <h2 id="live-venue-title">{text.liveVenue.title}</h2>
              <p>{text.liveVenue.paragraphOne}</p>
              <p>{text.liveVenue.paragraphTwo}</p>
              <p className="live-venue-highlight">{text.liveVenue.highlight}</p>
            </div>

            <aside className="live-venue-panel" aria-label={text.liveVenue.venueName}>
              <h3>{text.liveVenue.venueName}</h3>

              <address>
                <p>{text.liveVenue.addressLine1}</p>
                <p>{text.liveVenue.addressLine2}</p>
                <p>{text.liveVenue.addressLine3}</p>
                <p>{text.liveVenue.addressLine4}</p>
              </address>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Circolo+dei+Forestieri+Terrazza+delle+Sirene%2C+Via+Luigi+de+Maio+35%2C+Sorrento%2C+Napoli%2C+Italia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={text.liveVenue.directionsAriaLabel}
              >
                {text.liveVenue.directions}
              </a>

              <div className="live-venue-contacts" aria-label={text.liveVenue.venueContactsTitle}>
                <p>{text.liveVenue.venueContactsTitle}</p>
                <p>{text.liveVenue.venueEmailLabel}</p>
                <p>{text.liveVenue.venuePhoneLabel}</p>
              </div>

              <p className="live-venue-note">
                {text.liveVenue.artisticNotePrefix}{" "}
                <a href="#contacts">{text.liveVenue.artisticNoteLinkLabel}</a>{" "}
                {text.liveVenue.artisticNoteSuffix}
              </p>
            </aside>
          </div>
        </section>

        <section className="content-section" id="repertoire">
          <div className="content-section-inner repertoire-section-inner">
            <p className="section-kicker">{text.repertoire.kicker}</p>
            <h2>{text.repertoire.title}</h2>
            <p className="repertoire-intro">{text.repertoire.description}</p>

            <div className="repertoire-grid" aria-label={text.repertoire.title}>
              <article className="repertoire-item">
                <span className="repertoire-item-index" aria-hidden="true">01</span>
                <h3>{text.repertoire.categories.italian.title}</h3>
                <p>{text.repertoire.categories.italian.description}</p>
              </article>

              <article className="repertoire-item">
                <span className="repertoire-item-index" aria-hidden="true">02</span>
                <h3>{text.repertoire.categories.neapolitan.title}</h3>
                <p>{text.repertoire.categories.neapolitan.description}</p>
              </article>

              <article className="repertoire-item">
                <span className="repertoire-item-index" aria-hidden="true">03</span>
                <h3>{text.repertoire.categories.international.title}</h3>
                <p>{text.repertoire.categories.international.description}</p>
              </article>

              <article className="repertoire-item">
                <span className="repertoire-item-index" aria-hidden="true">04</span>
                <h3>{text.repertoire.categories.pop.title}</h3>
                <p>{text.repertoire.categories.pop.description}</p>
              </article>

              <article className="repertoire-item">
                <span className="repertoire-item-index" aria-hidden="true">05</span>
                <h3>{text.repertoire.categories.rock.title}</h3>
                <p>{text.repertoire.categories.rock.description}</p>
              </article>

              <article className="repertoire-item">
                <span className="repertoire-item-index" aria-hidden="true">06</span>
                <h3>{text.repertoire.categories.soul.title}</h3>
                <p>{text.repertoire.categories.soul.description}</p>
              </article>

              <article className="repertoire-item">
                <span className="repertoire-item-index" aria-hidden="true">07</span>
                <h3>{text.repertoire.categories.dance.title}</h3>
                <p>{text.repertoire.categories.dance.description}</p>
              </article>

              <article className="repertoire-item">
                <span className="repertoire-item-index" aria-hidden="true">08</span>
                <h3>{text.repertoire.categories.latin.title}</h3>
                <p>{text.repertoire.categories.latin.description}</p>
              </article>
            </div>

            <p className="repertoire-closing">{text.repertoire.closing}</p>
          </div>
        </section>

        <section className="media-section gallery-section" id="gallery" aria-labelledby="gallery-title">
          <div className="gallery-section-inner">
            <p className="section-kicker">{text.gallery.kicker}</p>
            <h2 id="gallery-title">{text.gallery.title}</h2>
            <p className="gallery-intro">{text.gallery.intro}</p>

            <GalleryLightbox
              items={galleryItems}
              onOpen={() => setOpenTracklistId(null)}
              narrative={{
                contemporaryTitle: text.gallery.contemporaryTitle,
                contemporaryText: text.gallery.contemporaryText,
                historyKicker: text.gallery.historyKicker,
                historyTitle: text.gallery.historyTitle,
                historyText: text.gallery.historyText,
              }}
              labels={{
                dialogLabel: text.gallery.dialogLabel,
                closeLabel: text.gallery.closeLabel,
                previousLabel: text.gallery.previousLabel,
                nextLabel: text.gallery.nextLabel,
              }}
            />
          </div>
        </section>

        <section className="content-section video-section" id="video" aria-labelledby="video-title">
          <div className="content-section-inner video-section-inner">
            <p className="section-kicker">{text.video.kicker}</p>
            <h2 id="video-title">{text.video.title}</h2>
            <p className="video-intro">{text.video.description}</p>

            <div className="video-grid">
              {videoItems.map((videoItem) => {
                const collection = text.video.collections[videoItem.key];
                const cardTitle = collection.title ?? videoItem.title;
                const youtubeId = getYouTubeId(videoItem.url);
                const embedUrl = getYouTubeEmbedUrl(videoItem.url);

                if (!embedUrl || !youtubeId) {
                  return null;
                }

                const stableVideoId = `video-${youtubeId}`;

                const cardClassName = videoItem.orientation === "portrait"
                  ? "video-card video-card-portrait"
                  : "video-card";

                return (
                  <article key={stableVideoId} className={cardClassName}>
                    <YouTubePlayer
                      playerId={stableVideoId}
                      embedUrl={embedUrl}
                      iframeTitle={collection.iframeTitle}
                      orientation={videoItem.orientation}
                    />

                    <div className="video-card-content">
                      <h3>{cardTitle}</h3>
                      <p>{collection.subtitle}</p>

                      <a
                        href={videoItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={collection.externalAriaLabel}
                      >
                        {text.video.externalLinkText}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="video-youtube-cta" aria-label={text.video.youtubeCta.title}>
              <div className="video-youtube-cta-copy">
                <span className="video-youtube-icon" aria-hidden="true">
                  <svg viewBox="0 0 96 68" role="presentation" focusable="false" aria-hidden="true">
                    <rect x="1" y="1" width="94" height="66" rx="16" fill="#ff0000" />
                    <path d="M40 20.5 65.5 34 40 47.5z" fill="#ffffff" />
                  </svg>
                </span>

                <div>
                  <h3>{text.video.youtubeCta.title}</h3>
                  <p>{text.video.youtubeCta.text}</p>
                </div>
              </div>

              <a
                href={youtubeChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{text.video.youtubeCta.button}</span>
                <svg viewBox="0 0 24 24" role="presentation" focusable="false" aria-hidden="true">
                  <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section ref={audioSectionRef} className="media-section audio-section" id="audio" aria-labelledby="audio-title">
          <div className="audio-section-inner">
            <p className="section-kicker">{text.audio.kicker}</p>
            <h2 id="audio-title">{text.audio.title}</h2>
            <p className="audio-intro">{text.audio.description}</p>

            <div className="audio-grid">
              {(showAllAudio ? audioCollections : audioCollections.slice(0, 3)).map((collection) => {
                const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(collection.externalUrl)}&color=%23c8a64a&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
                const tracklist = collection.tracklist ?? [];
                const isTracklistOpen = openTracklistId === collection.id;

                return (
                  <article key={collection.id} className="audio-card">
                    <h3>{collection.title}</h3>
                    <p>{collection.subtitle}</p>

                    <SoundCloudPlayer
                      playerId={`audio-${collection.id}`}
                      embedUrl={embedUrl}
                      iframeTitle={collection.iframeTitle}
                    />

                    <a
                      href={collection.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={collection.externalAriaLabel}
                    >
                      {text.audio.externalLinkText}
                    </a>

                    {tracklist.length > 0 && (
                      <button
                        type="button"
                        className="tracklist-toggle-btn"
                        onClick={() =>
                          setOpenTracklistId(isTracklistOpen ? null : collection.id)
                        }
                      >
                        {isTracklistOpen
                          ? text.audio.tracklistHide
                          : text.audio.tracklistButton}
                      </button>
                    )}

                    {tracklist.length > 0 && (
                      <TracklistDialog
                        isOpen={isTracklistOpen}
                        title={collection.title}
                        tracklist={tracklist}
                        onClose={() => setOpenTracklistId(null)}
                        labels={{
                          dialogLabel: `${text.audio.tracklistHeading}: ${collection.title}`,
                          closeLabel: text.audio.tracklistClose,
                          exportLabel: text.audio.tracklistExport,
                          tracklistHeading: text.audio.tracklistHeading,
                        }}
                      />
                    )}
                  </article>
                );
              })}
            </div>

            {audioCollections.length > 3 && (
              <div className="section-show-more">
                <button
                  type="button"
                  className="show-more-btn"
                  aria-expanded={showAllAudio}
                  onClick={() => {
                    if (showAllAudio) {
                      setShowAllAudio(false);
                      const section = audioSectionRef.current;

                      if (section) {
                        const top = section.getBoundingClientRect().top + window.scrollY - 80;

                        if (window.scrollY > top + 200) {
                          window.scrollTo({ top, behavior: "smooth" });
                        }
                      }
                    } else {
                      setShowAllAudio(true);
                    }
                  }}
                >
                  {showAllAudio ? text.audio.showLess : text.audio.showAll}
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="contact-preview" id="contacts">
          <div className="contact-preview-inner">
            <p className="section-kicker">{text.contacts.kicker}</p>
            <h2>{text.contacts.title}</h2>
            <h3>{text.contacts.subtitle}</h3>
            <p className="contact-preview-description">{text.contacts.description}</p>

            <form className="contact-form" onSubmit={handleContactSubmit} noValidate>
              <div className="contact-form-grid">
                <div className="contact-field">
                  <label htmlFor="contact-full-name">{text.contacts.fields.fullName}</label>
                  <input
                    id="contact-full-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder={text.contacts.placeholders.fullName}
                    value={contactFormData.fullName}
                    onChange={(event) => updateContactField("fullName", event.target.value)}
                    required
                  />
                  {fieldErrors.fullName && (
                    <p className="contact-field-error">{fieldErrors.fullName}</p>
                  )}
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">{text.contacts.fields.email}</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={text.contacts.placeholders.email}
                    value={contactFormData.email}
                    onChange={(event) => updateContactField("email", event.target.value)}
                    required
                  />
                  {fieldErrors.email && (
                    <p className="contact-field-error">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-event-type">{text.contacts.fields.eventType}</label>
                  <select
                    id="contact-event-type"
                    name="eventType"
                    autoComplete="off"
                    value={contactFormData.eventType}
                    onChange={(event) =>
                      updateContactField("eventType", event.target.value as EventType | "")
                    }
                    required
                  >
                    <option value="">-</option>
                    {eventTypeValues.map((value) => (
                      <option key={value} value={value}>
                        {text.contacts.eventTypes[value]}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.eventType && (
                    <p className="contact-field-error">{fieldErrors.eventType}</p>
                  )}
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-event-date">{text.contacts.fields.eventDate}</label>
                  <input
                    id="contact-event-date"
                    name="eventDate"
                    type="date"
                    value={contactFormData.eventDate}
                    min={minEventDate || undefined}
                    onChange={(event) => updateContactField("eventDate", event.target.value)}
                  />
                </div>

                <div className="contact-field contact-field-full">
                  <label htmlFor="contact-location">{text.contacts.fields.location}</label>
                  <input
                    id="contact-location"
                    name="location"
                    type="text"
                    autoComplete="address-level2"
                    placeholder={text.contacts.placeholders.location}
                    value={contactFormData.location}
                    onChange={(event) => updateContactField("location", event.target.value)}
                  />
                </div>

                <div className="contact-field contact-field-full">
                  <label htmlFor="contact-message">{text.contacts.fields.message}</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    placeholder={text.contacts.placeholders.message}
                    value={contactFormData.message}
                    onChange={(event) => updateContactField("message", event.target.value)}
                    required
                  />
                  {fieldErrors.message && (
                    <p className="contact-field-error">{fieldErrors.message}</p>
                  )}
                </div>

                <div className="contact-honeypot" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={contactFormData.website}
                    onChange={(event) => updateContactField("website", event.target.value)}
                  />
                </div>

                <div className="contact-field contact-field-full contact-consent-field">
                  <label htmlFor="contact-consent" className="contact-consent-label">
                    <input
                      id="contact-consent"
                      name="consent"
                      type="checkbox"
                      checked={contactFormData.consent}
                      onChange={(event) => updateContactField("consent", event.target.checked)}
                      required
                    />
                    <span>{text.contacts.fields.consent}</span>
                  </label>
                  {fieldErrors.consent && (
                    <p className="contact-field-error">{fieldErrors.consent}</p>
                  )}
                </div>
              </div>

              <div className="contact-form-actions">
                <button
                  type="submit"
                  disabled={formStatus === "sending"}
                  aria-disabled={formStatus === "sending"}
                >
                  {formStatus === "sending" ? text.contacts.sending : text.contacts.submit}
                </button>
              </div>

              <p
                className={
                  formStatus === "error"
                    ? "contact-form-status contact-form-status-error"
                    : "contact-form-status contact-form-status-success"
                }
                aria-live="polite"
                role="status"
              >
                {statusMessage}
              </p>
            </form>
          </div>
        </section>

        <footer className="site-footer">
          <span>© {new Date().getFullYear()} Ciro &amp; Dino Live Music</span>
        </footer>
      </div>

      <BackToTop ariaLabel={backToTopLabels[language]} targetId="home" />
    </main>
    </MediaPlaybackProvider>
  );
}
