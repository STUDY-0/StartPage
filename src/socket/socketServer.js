const http = require('http');
const socketIO = require('socket.io');

// 서버 생성
const server = http.createServer();
const io = socketIO(server);

// 클라이언트 연결 이벤트 처리
io.on('connection', (socket) => {
  console.log('클라이언트가 연결되었습니다.');

  // 클라이언트 연결 해제 이벤트 처리
  socket.on('disconnect', () => {
    console.log('클라이언트가 연결을 해제하였습니다.');
  });
});

// 서버 시작
const port = 3000;
server.listen(port, () => {
  console.log(`Socket.io 서버가 포트 ${port}에서 실행 중입니다.`);
});