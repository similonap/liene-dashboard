export interface ChecklistItem {
  id: string;
  label: string;
  emoji: string;
  alwaysVisible?: boolean; // ook tonen buiten het geplande tijdslot
  link?: {
    href: string;
    label: string;
    mathLock?: boolean; // vereist een wiskundeoefening om te openen
  };
}

export interface TimeSlot {
  startHour: number; // 0-23
  endHour: number;   // 0-23, exclusive
  page: 'morning-checklist';
  label: string;
}

export interface MorningChecklistPageConfig {
  title: string;
  subtitle: string;
  items: ChecklistItem[];
}

export interface Config {
  childName: string;
  mathExerciseUrl: string; // basis-URL voor de wiskundeoefening; doel-URL wordt als #hash toegevoegd
  timeSlots: TimeSlot[];
  pages: {
    'morning-checklist': MorningChecklistPageConfig;
  };
}

export const config: Config = {
  childName: 'Liene',
  mathExerciseUrl: 'https://puzzel.lienesimilon.be',

  // Voeg hier nieuwe tijdsloten toe: startHour t/m endHour (niet inbegrepen)
  timeSlots: [
    {
      startHour: 7,
      endHour: 9,
      page: 'morning-checklist',
      label: 'Ochtend routine',
    },
  ],

  pages: {
    'morning-checklist': {
      title: 'Goedemorgen',
      subtitle: 'Vergeet niets voor je naar school gaat! 🎒',
      items: [
        { id: 'ontbijt',  label: 'Ontbijt',                emoji: '🥣' },
        { id: 'tanden',   label: 'Tanden poetsen',          emoji: '🦷' },
        { id: 'kleren',   label: 'Kleren aan',              emoji: '👗' },
        { id: 'sokken',   label: 'Sokken aan',              emoji: '🧦' },
        { id: 'huiswerk', label: 'Huiswerk',                emoji: '📚' },
        {
          id: 'opdracht',
          label: 'Online opdracht gemaakt',
          emoji: '🧩',
          alwaysVisible: true,
          link: {
            href: 'https://puzzel.lienesimilon.be',
            label: 'Klik hier voor de puzzel!',
          },
        },
      ],
    },
  },
};
