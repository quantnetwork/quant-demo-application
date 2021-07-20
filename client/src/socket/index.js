import io from 'socket.io-client';

const socket = io(process.env.VUE_APP_SUBSCRIPTION_UPDATE_API);

export default socket;
