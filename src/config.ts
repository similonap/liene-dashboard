export interface ChecklistItem {
  id: string;
  label: string;
  emoji: string;
  alwaysVisible?: boolean;
  link?: {
    href: string;
    label: string;
  };
}

export interface TimeSlot {
  startHour: number;
  endHour: number;
  page: string;
  label: string;
}

export interface ChecklistPageConfig {
  title: string;
  subtitle: string;
  celebrationText: string;
  items: ChecklistItem[];
  completionButton?: {
    label: string;
    messageType: string;
  };
}

export interface UserConfig {
  name: string;
  timeSlots: TimeSlot[];
  pages: Record<string, ChecklistPageConfig>;
}

export interface AppConfig {
  users: Record<string, UserConfig>;
}

const fallbackChecklist: ChecklistPageConfig = {
  title: 'Even wachten!',
  subtitle: 'Doe eerst je opdracht, dan mag je spelen! 🎮',
  celebrationText: 'Je mag nu spelen! Veel plezier! 🎉',
  completionButton: {
    label: 'Ik mag spelen! 🚀',
    messageType: 'CHECKLIST_COMPLETED',
  },
  items: [
    {
      id: 'opdracht',
      label: 'Online opdracht gemaakt',
      emoji: '🧩',
      link: {
        href: 'https://puzzel.lienesimilon.be',
        label: 'Klik hier voor de puzzel!',
      },
    },
  ],
}

const lienesPages: Record<string, ChecklistPageConfig> = {
  'fallback-checklist': fallbackChecklist,
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
}

export const config: AppConfig = {
  users: {
    liene: {
      name: 'Liene',
      timeSlots: [
        { startHour: 7,  endHour: 9,  page: 'morning-checklist',  label: 'Ochtend routine' },
        { startHour: 19, endHour: 21, page: 'evening-checklist',  label: 'Avond routine' },
        { startHour: 0,  endHour: 24, page: 'fallback-checklist', label: 'Vrije tijd' },
      ],
      pages: lienesPages,
    },

    lotte: {
      name: 'Lotte',
      timeSlots: [
        { startHour: 7,  endHour: 9,  page: 'morning-checklist',  label: 'Ochtend routine' },
        { startHour: 19, endHour: 21, page: 'evening-checklist',  label: 'Avond routine' },
        { startHour: 0,  endHour: 24, page: 'fallback-checklist', label: 'Vrije tijd' },
      ],
      pages: lienesPages,
    },
  },
}
