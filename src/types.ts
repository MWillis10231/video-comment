import type { UUIDTypes } from "uuid";
import type { COMMENT_KEY, EVENT_TYPE, PAGE } from "./enum";
import type { FONT_FAMILIES, SETTINGS_KEY } from "./enum";

type CommentType = {
  [COMMENT_KEY.ID]: UUIDTypes;
  [COMMENT_KEY.START_TIMESTAMP]: string;
  [COMMENT_KEY.END_TIMESTAMP]?: string | null;
  [COMMENT_KEY.EVENT_TYPES]: EVENT_TYPE[];
  [COMMENT_KEY.INCLUDE_ON_HIGHLIGHTS]: boolean;
  [COMMENT_KEY.EXPLANATION]: string;
  [COMMENT_KEY.DELETED]?: boolean;
  [COMMENT_KEY.INCLUDE_ON_AWARD_SHORTLIST]?: boolean;
};

export type ColorValueHex = `#${string}`;

type Settings = {
  [SETTINGS_KEY.FONT_FAMILY]?: FONT_FAMILIES;
  [SETTINGS_KEY.DARK_HIGHLIGHT_COLOR]?: ColorValueHex;
  [SETTINGS_KEY.LIGHT_HIGHLIGHT_COLOR]?: ColorValueHex;
  [SETTINGS_KEY.START_TIMESTAMP_PADDING]?: number;
  [SETTINGS_KEY.OPEN_PAGE]?: PAGE;
};

export type {
  CommentType,
  Settings,
};
