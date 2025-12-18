const convertTimeStampStringToTimeStampObject = (timestamp: string): { hours: number, minutes: number, seconds: number } => {
  try {
    validateTimeStamp(timestamp, "convertTimeStampStringToTimeStampObject");

    const valuesArray = timestamp.split(":").reverse();

    return {
      seconds: valuesArray[0] ? Number(valuesArray[0]) : 0,
      minutes: valuesArray[1] ? Number(valuesArray[1]) : 0,
      hours: valuesArray[2] ? Number(valuesArray[2]) : 0,
    };
  } catch (error) {
    console.error("Error converting timestamp string to object:", error, timestamp);

    throw error;
  }
}

const convertTimeStampObjectToTimeStampString = ({ hours = 0, minutes = 0, seconds = 0 } = {}): string => {
  const encodedHours = hours.toString().padStart(2, '0');
  const encodedMinutes = minutes.toString().padStart(2, '0');
  const encodedSeconds = seconds.toString().padStart(2, '0');

  const result = `${encodedHours}:${encodedMinutes}:${encodedSeconds}`;

  validateTimeStamp(result, "convertTimeStampObjectToTimeStampString");

  return result;;
}

const convertTimeStampToDate = (timestamp: string): Date => {
  validateTimeStamp(timestamp, "convertTimeStampToDate");

  const { hours, minutes, seconds } = convertTimeStampStringToTimeStampObject(timestamp);
  const date = new Date();
  date.setHours(hours, minutes, seconds);

  return date;
}

const convertDateToTimeStamp = (date: Date): string => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  const result = convertTimeStampObjectToTimeStampString({ hours, minutes, seconds });

  validateTimeStamp(result, "convertDateToTimeStamp");

  return result;
}

const isValidTimeStamp = (timestamp: string): boolean => {
  const timePattern = /^(?:([01]?\d|2[0-3]):)?([0-5]?\d):([0-5]\d)$/;
  return timePattern.test(timestamp);
}

// TODO - make sure the usages outside of the service are ok and don't need parseTimeStamp instead
/**
 *
 * @param timestamp
 * @throws Error if the timestamp is not in the format "HH:MM:SS or "MM:SS"
 * @returns void
 */
const validateTimeStamp = (timestamp: string, functionName: string): void => {
  try {
    const isValid = isValidTimeStamp(timestamp);

    if (!isValid) {
      throw new Error(`Invalid timestamp format. Provided: ${timestamp}`);
    }
  } catch (error: unknown) {
    console.error(error, functionName);

    throw error;
  };
};

/**
 *
 * @param timestamp
 * @returns a string in the format "HH:MM:SS" ensuring the timestamp is valid and has leading zeros
 */
const parseTimeStamp = (timestamp: string): string => {
  validateTimeStamp(timestamp, "parseTimeStamp");

  const timeStampObject = convertTimeStampStringToTimeStampObject(timestamp);
  const parsedTimeStamp = convertTimeStampObjectToTimeStampString(timeStampObject);

  return parsedTimeStamp;
}

const isTimeStampTruthy = (timestamp: string): boolean => {
  validateTimeStamp(timestamp, "isTimeStampTruthy");

  const timeStampObject = convertTimeStampStringToTimeStampObject(timestamp);
  const parsedTimeStamp = convertTimeStampObjectToTimeStampString(timeStampObject);
  const isValid = isValidTimeStamp(parsedTimeStamp);

  const isEmpty = parsedTimeStamp === "00:00:00";
  const isZero = parsedTimeStamp === "00:00:00";

  return isValid && !isEmpty && !isZero;
};

const compareTimeStamps = (timestampOne: string, timestampTwo: string) => {
  try {
    validateTimeStamp(timestampOne, "compareTimeStamps1");
    validateTimeStamp(timestampTwo, "compareTimeStamps2");

    const timeStampOne = convertTimeStampStringToTimeStampObject(timestampOne);
    const dateOne = new Date();
    dateOne.setHours(timeStampOne.hours, timeStampOne.minutes, timeStampOne.seconds);

    const timeStampTwo = convertTimeStampStringToTimeStampObject(timestampTwo);
    const dateTwo = new Date();
    dateTwo.setHours(timeStampTwo.hours, timeStampTwo.minutes, timeStampTwo.seconds);

    let result = 0;

    if (dateOne.getTime() < dateTwo.getTime()) {
      result = -1;
    }

    if (dateOne.getTime() > dateTwo.getTime()) {
      result = 1;
    }

    return result;
  } catch (error) {
    console.error("Error comparing timestamps:", error, timestampOne, timestampTwo);

    throw error;
  }
};

const isFirstTimeStampOlder = (timestampOne: string, timestampTwo: string): boolean => {
  try {
    validateTimeStamp(timestampOne, "isFirstTimeStampOlder1");
    validateTimeStamp(timestampTwo, "isFirstTimeStampOlder2");

    return compareTimeStamps(timestampOne, timestampTwo) === -1;
  }
  catch (error) {
    console.error("Error comparing timestamps by time:", error, timestampOne, timestampTwo);

    throw error;
  }
};

export {
  compareTimeStamps,
  convertTimeStampToDate,
  convertDateToTimeStamp,
  validateTimeStamp,
  parseTimeStamp,
  isTimeStampTruthy,
  isFirstTimeStampOlder,
}
