import {
  CREATED, FAILED, PENDING, SUCCESSFUL,
} from '@/constants/transaction/transactionStatusTypes';
import Statuses from '@/constants/transaction/statuses';
import convertDate from '@/helpers/convertDate';
import {
  getObjectFromStorage,
  getWithExpiry,
  setWithExpiry,
  updateObjectInStorage,
} from './storage';

export const AUTH_PARAMS = 'AUTH_PARAMS';
export const AUDIT_TYPE = 'AUDIT_TYPE';

export const getToken = () => getWithExpiry(AUTH_PARAMS);
export const saveAuthToken = (token) => setWithExpiry(AUTH_PARAMS, token, 60);

export const slice = (value) => {
  if (typeof value !== 'string') {
    return value;
  }
  if (value?.length >= 13) {
    const start = value.slice(0, 5);
    const end = value.slice(value.length - 5, value.length);
    return `${start}...${end}`;
  }
  return value;
};

export const getAuditType = (overledgerTransactionId) => {
  const auditTypes = getObjectFromStorage(AUDIT_TYPE);
  if (auditTypes) {
    return auditTypes[overledgerTransactionId] || null;
  }
  return null;
};

export const setAuditType = (data) => {
  updateObjectInStorage(AUDIT_TYPE, data);
};

export const mapOverledgerTransactionDataMethod = (overledgerTransaction) => {
  if (!overledgerTransaction?.overledgerTransactionDetails) {
    return {};
  }
  const {
    overledgerTransactionDetails,
    location,
    timestamp,
    transactionHistory,
    status,
  } = overledgerTransaction;

  const statusHistory = transactionHistory?.status?.map((tracking) => {
    let statusInfo = {};
    switch (tracking.value) {
      case CREATED:
        statusInfo = {
          class: 'status-created',
          statusLabel: Statuses[CREATED],
        };
        break;
      case PENDING:
        statusInfo = {
          class: tracking.value === status.value
            ? 'status-pending' : 'status-created',
          statusLabel: Statuses[PENDING],
        };
        break;
      case FAILED:
        statusInfo = {
          class: 'status-failed',
          statusLabel: Statuses[FAILED],
        };
        break;
      case SUCCESSFUL:
        statusInfo = {
          class: 'status-successful',
          statusLabel: Statuses[SUCCESSFUL],
        };
        break;
      default:
        break;
    }
    return {
      ...tracking,
      ...statusInfo,
      timestamp: convertDate(tracking.timestamp) || 'NA',
    };
  });
  if (status?.value === PENDING) {
    statusHistory.push({
      value: SUCCESSFUL,
      timestamp: 'processing',
      class: 'status-successful-pr',
      statusLabel: Statuses[SUCCESSFUL],
    });
  }

  return {
    ...overledgerTransactionDetails,
    currentStatus: overledgerTransaction.status,
    transactionId: overledgerTransactionDetails.transactionId,
    dltType: location?.technology || '-',
    dlnType: location?.network || '-',
    transactionDateTime: convertDate(timestamp),
    statusHistory,
  };
};

export const timeStempMapper = (timestamp) => {
  if (timestamp && timestamp.epochSecond && timestamp.nano) {
    const concated = `${timestamp.epochSecond}${timestamp.nano}`;
    return convertDate(new Date(+concated / 1000));
  }
  if (typeof timestamp === 'string') {
    return convertDate(timestamp);
  }
  return 'NA';
};

export const capitalizeFirstLetter = (string) => (
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
);
