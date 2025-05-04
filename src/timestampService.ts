const convertTimeStampStringToTimeStampObject = (timestamp: string): { hours: number, minutes: number, seconds: number } => {
  const valuesArray = timestamp.split(":").reverse();

  return {
    seconds: valuesArray[0] ? Number(valuesArray[0]) : 0,
    minutes: valuesArray[1] ? Number(valuesArray[1]) : 0,
    hours: valuesArray[2] ? Number(valuesArray[2]) : 0,
  };
}

const convertTimeStampObjectToTimeStampString = ({ hours = 0, minutes = 0, seconds = 0 } = {}): string => {
  const encodedHours = hours.toString().padStart(2, '0');
  const encodedMinutes = minutes.toString().padStart(2, '0');
  const encodedSeconds = seconds.toString().padStart(2, '0');

  return `${encodedHours}:${encodedMinutes}:${encodedSeconds}`;
}

const convertTimeStampToDate = (timestamp: string): Date => {
  const { hours, minutes, seconds } = convertTimeStampStringToTimeStampObject(timestamp);
  const date = new Date();
  date.setHours(hours, minutes, seconds);

  return date;
}

const convertDateToTimeStamp = (date: Date): string => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return convertTimeStampObjectToTimeStampString({ hours, minutes, seconds });
}

const isValidTimeStamp = (timestamp: string): boolean => {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  return timePattern.test(timestamp);
}

const validateTimeStamp = (timestamp: string): string => {
  const timeStampObject = convertTimeStampStringToTimeStampObject(timestamp);
  const parsedTimeStamp = convertTimeStampObjectToTimeStampString(timeStampObject);

  const isValid = isValidTimeStamp(parsedTimeStamp);

  if (!isValid) {
    throw new Error(`Invalid timestamp format. Provided: ${timestamp}`);
  }

  return parsedTimeStamp;
};

const isTimeStampTruthy = (timestamp: string): boolean => {
  const timeStampObject = convertTimeStampStringToTimeStampObject(timestamp);
  const parsedTimeStamp = convertTimeStampObjectToTimeStampString(timeStampObject);
  const isValid = isValidTimeStamp(parsedTimeStamp);

  const isEmpty = parsedTimeStamp === "00:00:00";
  const isZero = parsedTimeStamp === "00:00:00";

  return isValid && !isEmpty && !isZero;
};

const compareTimeStamps = (timestampOne: string, timestampTwo: string) => {
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
};

const isFirstTimeStampOlder = (timestampOne: string, timestampTwo: string): boolean => {
  return compareTimeStamps(timestampOne, timestampTwo) === -1;
};

export {
  compareTimeStamps,
  convertTimeStampToDate,
  convertDateToTimeStamp,
  validateTimeStamp,
  isTimeStampTruthy,
  isFirstTimeStampOlder,
}
