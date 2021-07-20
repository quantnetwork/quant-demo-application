import { MESSAGE_CLASSES } from '@/constants/consoleOutput/outputFields';

// eslint-disable-next-line import/prefer-default-export
export const wrapInTag = (key, timeout = 0, {
  message,
  messageFirstPart,
  messageSecondPart,
}) => ({
  key,
  timeout,
  message: message || `${messageFirstPart} <span class="${MESSAGE_CLASSES.successMessage}">${messageSecondPart}</span>`,
});
