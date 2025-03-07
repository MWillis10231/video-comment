import type { UUIDTypes } from "uuid";
import type { EVENT_TYPE } from "./enum";

type CommentType = {
  id: UUIDTypes;
  startTimestamp: string;
  endTimestamp: string;
  eventType: EVENT_TYPE;
  includeOnHighlights: boolean;
  explanation: string;
};

export type {
  CommentType
};
