import { 
  EVENT_TYPE, 
  EVENT_TYPE_CATEGORY 
} from './enum';

const EVENT_TYPE_TO_DESCRIPTION_MAP = {
  [EVENT_TYPE.GOAL]: 'Goal',
  [EVENT_TYPE.PASS]: 'Pass',
  [EVENT_TYPE.SHOT]: 'Shot',
  [EVENT_TYPE.CONTROL]: 'Control',
  [EVENT_TYPE.TACKLE]: 'Tackle',
  [EVENT_TYPE.DEFENSIVE_ACTION]: 'Defensive Action',
  [EVENT_TYPE.SAVE]: 'Save',
  [EVENT_TYPE.FOUL]: 'Foul',
  [EVENT_TYPE.YELLOW_CARD]: 'Yellow Card',
  [EVENT_TYPE.RED_CARD]: 'Red Card',
  [EVENT_TYPE.SKILL]: 'Skill',
  [EVENT_TYPE.INJURY]: 'Injury',
  [EVENT_TYPE.OFFSIDE]: 'Offside',
  [EVENT_TYPE.PENALTY]: 'Penalty',
  [EVENT_TYPE.FREE_KICK]: 'Free Kick',
  [EVENT_TYPE.CORNER]: 'Corner',
  [EVENT_TYPE.THROW_IN]: 'Throw In',
  [EVENT_TYPE.SUBSTITUTION]: 'Substitution',
  [EVENT_TYPE.BLOOPER]: 'Blooper',
  [EVENT_TYPE.KICK_OFF]: 'Kick Off',
  [EVENT_TYPE.HALF_TIME]: 'Half Time',
  [EVENT_TYPE.FULL_TIME]: 'Full Time',
  [EVENT_TYPE.EXTRA_TIME]: 'Extra Time',
  [EVENT_TYPE.PENALTY_SHOOTOUT]: 'Penalty Shootout',
  [EVENT_TYPE.OTHER]: 'Other',
}

const EVENT_TYPE_CATEGORY_MAP = {
  [EVENT_TYPE_CATEGORY.ATTACK]: {
    name: 'Attack',
    color: '#f44336',
    emoji: '⚔️',
    eventTypes: [
      EVENT_TYPE.GOAL,
      EVENT_TYPE.PASS,
      EVENT_TYPE.SHOT,
      EVENT_TYPE.SKILL,
      EVENT_TYPE.CONTROL,
    ]
  },
  [EVENT_TYPE_CATEGORY.DEFENSE]: {
    name: 'Defense',
    color: '#4caf50',
    emoji: '🛡️',
    eventTypes: [
      EVENT_TYPE.TACKLE,
      EVENT_TYPE.DEFENSIVE_ACTION,
      EVENT_TYPE.SAVE,
    ]
  },
  [EVENT_TYPE_CATEGORY.DISCIPLINE]: {
    name: 'Discipline',
    color: '#ffeb3b',
    emoji: '🤬',
    eventTypes: [
      EVENT_TYPE.FOUL,
      EVENT_TYPE.YELLOW_CARD,
      EVENT_TYPE.RED_CARD,
    ]
  },
  [EVENT_TYPE_CATEGORY.SET_PIECE]: {
    name: 'Set Piece',
    color: '#2196f3',
    emoji: '🚩',
    eventTypes: [
      EVENT_TYPE.PENALTY,
      EVENT_TYPE.FREE_KICK,
      EVENT_TYPE.CORNER,
      EVENT_TYPE.THROW_IN,
    ]
  },
  [EVENT_TYPE_CATEGORY.TEMPORAL]: {
    name: 'Temporal',
    color: '#9c27b0',
    emoji: '⌛',
    eventTypes: [
      EVENT_TYPE.KICK_OFF,
      EVENT_TYPE.HALF_TIME,
      EVENT_TYPE.FULL_TIME,
      EVENT_TYPE.EXTRA_TIME,
      EVENT_TYPE.PENALTY_SHOOTOUT,
    ]
  },
  [EVENT_TYPE_CATEGORY.OTHER]: {
    name: 'Other',
    color: '#607d8b',
    emoji: '🤷‍♂️',
    eventTypes: [
      EVENT_TYPE.INJURY,
      EVENT_TYPE.OFFSIDE,
      EVENT_TYPE.SUBSTITUTION,
      EVENT_TYPE.BLOOPER,
      EVENT_TYPE.OTHER,
    ]
  },
}

export {
  EVENT_TYPE_TO_DESCRIPTION_MAP,
  EVENT_TYPE_CATEGORY_MAP,
}