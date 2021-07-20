const createSocketPlugin = (socket) => (store) => {
  socket.on('transactionUpdate', (payload) => {
    store.dispatch('updateStatusesTransaction', payload);
    store.dispatch('linkedTransaction/updateStatusesTransaction', payload);
    store.dispatch('updateStatusesSubscription', payload);
  });
};

export default createSocketPlugin;
