export const setWithExpiry = (key, value, ttl, ttlType = 'minutes') => {
  const now = new Date();
  if (ttlType === 'days') {
    now.setDate(now.getDate() + ttl);
  } else if (ttlType === 'minutes') {
    now.setMinutes(now.getMinutes() + ttl);
  } else if (ttlType === 'seconds') {
    now.setSeconds(now.getSeconds() + ttl);
  }
  const item = {
    value,
    expiry: now.getTime(),
  };
  window.localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = (key) => {
  const itemStr = window.localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    window.localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

export const updateObjectInStorage = (key, data) => {
  let obj = {};
  const itemStr = window.localStorage.getItem(key);
  if (itemStr) {
    try {
      obj = JSON.parse(itemStr);
    } catch { obj = {}; }
  }
  obj = {
    ...obj,
    ...data,
  };
  window.localStorage.setItem(key, JSON.stringify(obj));
};

export const getObjectFromStorage = (key) => {
  let obj = {};
  const itemStr = window.localStorage.getItem(key);
  if (itemStr) {
    try {
      obj = JSON.parse(itemStr);
    } catch { obj = {}; }
  }
  return obj;
};
