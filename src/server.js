import Server from 'socket.io';

const port = process.env.PORT || 8090;

export default function startServer (store) {
  const io = new Server().listen(port);
  console.log(`🌎 socket.io listening on port ${port}`);

  io.on('connection', (socket) => {
    
    // The `handshake` is an undocumented feature
    // It might not be smart to rely on its query parameter,
    // but it makes for a nice way for the client to 
    // connect to a specific league's room
    const { leagueId, userId } = socket.handshake.query

    // One tradeoff with using a single store is that we have to subscribe to our 
    // store for each connected socket, and all subscription callbacks
    // will be invoked for any league's change.
    const unsubscribe = store.subscribe(() => {
      socket.emit(`DRAFT_STATE_${leagueId}`, store.getState().get(leagueId).toJS())
    });

    console.log(`user ${userId} connected to league ${leagueId}`);

    store.dispatch({
      type: 'USER_CONNECTED',
      payload: { userId, leagueId }
    });
    
    socket.on('disconnect', (socket) => {
      store.dispatch({
        type: 'USER_DISCONNECTED',
        payload: { userId, leagueId }
      });
      unsubscribe();
      console.log(`user ${userId} disconnected from room ${leagueId}`);
    });

    socket.on('action', store.dispatch.bind(store));
  });
};
