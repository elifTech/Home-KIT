import awsStore from 'aws/store';

export default socketServer => {
  const connections = [];
  socketServer.on('connection', socket => {
    console.log('socket connected', socket);

    socket.on('userId', data => {
      console.log('RECEIVED user id', data);
      socket.userId = data.user;
      connections.push(socket);
      if (awsStore.hasOwnProperty(data.user)) {
        for (var key in awsStore[data.user]) {
          if (!awsStore[data.user].hasOwnProperty(key) || key == 'timestamp') {
            continue;
          }
          awsStore[data.user][key].subscribe(socket, key);
        }
      }
    });

    socket.on('message', data => {
      console.log('connections!!', connections);
      connections.forEach(connectedSocket => {
        if (connectedSocket !== socket) {
        }
      });
    });

    socket.on('disconnect', () => {
      const index = connections.indexOf(socket);
      connections.splice(index, 1);
    })
  })
}
