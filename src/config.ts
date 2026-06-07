export interface ChecklistItem {
  id: string;
  label: string;
  emoji: string;
  alwaysVisible?: boolean; // ook tonen buiten het geplande tijdslot
  link?: {
    href: string;
    label: string;
  };
}

export interface TimeSlot {
  startHour: number; // 0-23
  endHour: number;   // 0-23, exclusive
  page: 'morning-checklist' | 'evening-checklist';
  label: string;
}

export interface ChecklistPageConfig {
  title: string;
  subtitle: string;
  celebrationText: string;
  items: ChecklistItem[];
  completionButton?: {
    label: string;
    messageType: string; // window.postMessage({ type: messageType }, '*')
  };
}

export interface Config {
  childName: string;
  timeSlots: TimeSlot[];
  pages: {
    'morning-checklist': ChecklistPageConfig;
    'evening-checklist': ChecklistPageConfig;
  };
}

export const config: Config = {
  childName: 'Liene',

  timeSlots: [
    {
      startHour: 7,
      endHour: 9,
      page: 'morning-checklist',
      label: 'Ochtend routine',
    },
    {
      startHour: 19,
      endHour: 21,
      page: 'evening-checklist',
      label: 'Avond routine',
    },
  ],

  pages: {
    'morning-checklist': {
      title: 'Even wachten!',
      subtitle: 'Doe eerst je taken, dan mag je spelen! 🎮',
      celebrationText: 'Je mag nu spelen! Veel plezier! 🎉',
      completionButton: {
        label: 'Ik mag spelen! 🚀',
        messageType: 'CHECKLIST_COMPLETED',
      },
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

    'evening-checklist': {
      title: 'Even wachten!',
      subtitle: 'Doe eerst je taken, dan mag je spelen! 🎮',
      celebrationText: 'Je mag nu spelen! Veel plezier! 🎉',
      completionButton: {
        label: 'Ik mag spelen! 🎮',
        messageType: 'CHECKLIST_COMPLETED',
      },
      items: [
        { id: 'avond-tanden', label: 'Tanden poetsen', emoji: '🦷' },
        {
          id: 'spel',
          label: 'Het spel gespeeld',
          emoji: '🎮',
          link: {
            href: 'https://puzzel.lienesimilon.be',
            label: 'Speel het spel!',
          },
        },
      ],
    },
  },
};
