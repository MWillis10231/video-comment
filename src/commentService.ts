import type { CommentType } from "./types";
import { EVENT_TYPE_TO_DESCRIPTION_MAP } from "./constants";
import { EVENT_TYPE } from "./enum";

const convertCommentStringToCommentObject = (commentString: string): CommentType | null => {
  const includeOnHighlights = commentString?.includes("⭐") || false;
  const cleanedCommentString = commentString?.replace("⭐", "").trim() || "";

  const timeStampsRegex = new RegExp(/([0-9][0-9]?:)?([0-9]?)([0-9]:[0-9][0-9])+/g);
  const timeStampsMatch = cleanedCommentString.match(timeStampsRegex);

  const eventTypeRegex = new RegExp(/(?<=\[).+?(?=\])/g);
  const eventTypeMatch = cleanedCommentString.match(eventTypeRegex);

  const explanationRegex = new RegExp(/(?<=\]\s*-?\s*)[^\s-].*$/g);
  const explanationMatch = cleanedCommentString.match(explanationRegex);

  const [startTimestamp, endTimestamp] = timeStampsMatch || [];
  const [eventTypeString] = eventTypeMatch || [];
  const [explanation] = explanationMatch || [];

  const eventType = (Object.entries(EVENT_TYPE_TO_DESCRIPTION_MAP) as [EVENT_TYPE, string][])
    .find(([, description]) => description.toLowerCase() === eventTypeString?.toLowerCase())?.[0];

  return {
    id: crypto.randomUUID(),
    startTimestamp: startTimestamp || "",
    endTimestamp: endTimestamp || "",
    eventType: eventType || EVENT_TYPE.OTHER,
    includeOnHighlights,
    explanation: explanation || "",
  };
}

const parseComments = (commentStringArray: (string)[]): (CommentType)[] => {
  const comments = commentStringArray.map(commentString => convertCommentStringToCommentObject(commentString));
  const filteredComments = comments.filter(comment => comment !== null) as CommentType[];

  return filteredComments;
};

export {
  parseComments
}
