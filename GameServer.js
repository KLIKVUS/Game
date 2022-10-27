console.clear();
console.log("\n>> SERVER ANSWERS");

let range = [];

const zmq = require("zeromq");
const response = zmq.socket("rep");

response.bind("tcp://127.0.0.1:60123", (err) => {
  if (err) throw err;
  console.log("> Server started !!");
});

response.on("message", (data) => {
  const request = JSON.parse(data);

  if (request.range) {
    console.log("> Client say:", request.range);
    let [min, max] = request.range.split("-");
    for (min; min <= max; ++min) range.push(min);

    let answer = range[Math.floor(range.length / 2) - 1];
    return response.send(JSON.stringify({ answer }));
  } else if (request.hint === "more") {
    console.log("> Client say:", request.hint);
    range.splice(0, Math.floor(range.length / 2));
    let answer = range[Math.floor(range.length / 2) - 1];

    return response.send(JSON.stringify({ answer }));
  } else if (request.hint === "less") {
    console.log("> Client say:", request.hint);
    range.splice(Math.floor(range.length / 2), range.length);
    let answer = range[Math.floor(range.length / 2) - 1];

    return response.send(JSON.stringify({ answer }));
  }

  console.log("> Client say:", request.result);
});
