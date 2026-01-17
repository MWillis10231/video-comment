import type { CommentType } from "./types";
import { EVENT_TYPE } from "./enum";
import { compareTimeStamps } from '@/timestampService';
import {  DESCRIPTION_TO_EVENT_TYPE_MAP, EVENT_TYPE_TO_DESCRIPTION_MAP } from "./constants";

const convertCommentStringToCommentObject = (commentString: string): CommentType | null => {
  const includeOnHighlights = commentString?.includes("⭐") || false;
  const includeOnAwardShortlist = commentString?.includes("🏆") || false;

  const cleanedCommentString = commentString?.replace(/⭐|🏆/g, "").trim() || "";

  const timeStampsRegex = new RegExp(/([0-9][0-9]?:)?([0-9]?)([0-9]:[0-9][0-9])+/g);
  const timeStampsMatch = cleanedCommentString.match(timeStampsRegex);

  const eventTypeRegex = new RegExp(/(?<=\[).+?(?=\])/g);
  const eventTypeMatch = cleanedCommentString.match(eventTypeRegex)


  const explanationRegex = new RegExp(/(?<=\]\s*-?\s*)[^\s-].*$/g);
  const explanationMatch = cleanedCommentString.match(explanationRegex);

  const [startTimestamp, endTimestamp] = timeStampsMatch || [];
  const [eventTypeString] = eventTypeMatch || [];
  const [explanation] = explanationMatch || [];

  const eventTypesRawArray = eventTypeString?.split(",").map(type => type.trim()) || [];

  const EVENT_DESCRIPTIONS = Object.values(EVENT_TYPE_TO_DESCRIPTION_MAP);

  const eventTypesStringArray = eventTypesRawArray.filter((typeString: string) => EVENT_DESCRIPTIONS.includes(typeString));
  const eventTypesArray: EVENT_TYPE[] = eventTypesStringArray.map((stringType) => DESCRIPTION_TO_EVENT_TYPE_MAP[stringType])

  if (!startTimestamp) {
    console.warn("Invalid comment string, missing start timestamp:", commentString);

    return null;
  }

  return {
    id: crypto.randomUUID(),
    startTimestamp: startTimestamp || "",
    endTimestamp: endTimestamp || "",
    eventTypes: eventTypesArray.length ? eventTypesArray : [EVENT_TYPE.OTHER],
    includeOnHighlights,
    explanation: explanation || "",
    includeOnAwardShortlist,
  };
}

const parseComments = (commentStringArray: (string)[]): (CommentType)[] => {
  const comments = commentStringArray.map(commentString => convertCommentStringToCommentObject(commentString));
  console.log("Parsed comments:", comments);
  const filteredComments = comments.filter(comment => comment !== null) as CommentType[];

  return filteredComments;
};

const sortComments = (comments: CommentType[]) => {
  try {
    return comments.sort((a, b) => {
      try {
        const result = compareTimeStamps(a.startTimestamp, b.startTimestamp);
        const areTimestampsEqual = result === 0;

        return areTimestampsEqual && a.endTimestamp && b.endTimestamp
          ? compareTimeStamps(a.endTimestamp, b.endTimestamp)
          : result;
      } catch (error) {
        console.error("Error comparing timestamps:", error, a, b);

        throw error;
      }
    });
  } catch (error) {
    console.error("Error sorting comments:", error);

    throw error;
  }
}

const retrieveStoredCommentsFromLocalStorage = (): CommentType[] => {
  const storedComments = localStorage.getItem("comments");

  // console.log("Stored comments:", storedComments);
  // console.log("Parsed comments:", JSON.parse(storedComments || "[]"));

  return storedComments ? sortComments(JSON.parse(storedComments)) : [];
}

const storeCommentsInLocalStorage = (comments: CommentType[]) => {
  localStorage.setItem("comments", JSON.stringify(comments));
}

const clearStoredCommentsFromLocalStorage = () => {
  localStorage.removeItem("comments");
};


export {
  parseComments,
  sortComments,
  retrieveStoredCommentsFromLocalStorage,
  storeCommentsInLocalStorage,
  clearStoredCommentsFromLocalStorage,
}
