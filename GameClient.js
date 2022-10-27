console.clear();
console.log("\n>> CLIENT ANSWER");

const minNum = process.argv[2];
const maxNum = process.argv[3];
const range = `${minNum}-${maxNum}`;
const randNum = Math.floor(Math.random() * (maxNum - minNum) + minNum);
console.log(`> Pick number ${randNum}`);

const zmq = require("zeromq");
const request = zmq.socket("req");

request.on("message", (data) => {
  const response = JSON.parse(data);
  console.log("> Server answer:", response.answer);

  if (response.answer < randNum) {
    return request.send(JSON.stringify({ hint: "more" }));
  } else if (response.answer > randNum) {
    return request.send(JSON.stringify({ hint: "less" }));
  } else if (response.answer === randNum) {
    console.log("> He knows the number!!");
    request.send(JSON.stringify({ result: "Your answer is correct!" }));
  }
});

request.connect("tcp://127.0.0.1:60123");
request.send(JSON.stringify({ range: `${range}` }));
console.log(`> Send range ${range}`);
