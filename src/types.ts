import type { UUIDTypes } from "uuid";
import type { EVENT_TYPE } from "./enum";
import type { FONT_FAMILIES, SETTINGS_KEY } from "./enum";

type CommentType = {
  id: UUIDTypes;
  startTimestamp: string;
  endTimestamp?: string | null;
  eventTypes: EVENT_TYPE[];
  includeOnHighlights: boolean;
  explanation: string;
  deleted?: boolean;
  includeOnAwardShortlist?: boolean;
};

export type ColorValueHex = `#${string}`;

type Settings = {
  [SETTINGS_KEY.FONT_FAMILY]?: FONT_FAMILIES;
  [SETTINGS_KEY.DARK_HIGHLIGHT_COLOR]?: ColorValueHex;
  [SETTINGS_KEY.LIGHT_HIGHLIGHT_COLOR]?: ColorValueHex;
};

type EventTypeString = {
  [Property in keyof EVENT_TYPE]: string;
}

export type {
  CommentType,
  Settings,
  EventTypeString
};
