const Discord = require('discord.js');
const client = new Discord.Client();
const http = require('http');
const port = process.env.PORT;
const { Client } = require('pg')
const pg = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

pg.connect();

function register(first, id) {
  console.log(first)
  console.log(id)
  var text = `INSERT INTO Users (FirstName, discord_id) VALUES ('${first}', ${id});`;
  pg.query(text, (err, res) => {
    console.log(res);
    console.log(err);
  });
}

function discord_check(id) {
  var text = `select exists(select 1 from Users where discord_id = ${id})`;
  var result = {}
  pgs.query(text, (err, res) => {
    consdole.log(res);
    console.log(err);
    result = res
  });
  return result
}

const requestHandler = (request, response) => {
  console.log(request.url);
  response.end('server requested');
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'r!') {
    msg.reply('yay')
  }
  else if (msg.content === 'r!create') {
    var atr = msg.author
    console.log(discord_check(atr.id))
    if (discord_check(atr.id)) {
      msg.reply('You\'re already registered!')
    }
    else {
      register(atr.username, atr.id);
      msg.reply('Your user has been created!')
    }
  }
});

client.login(process.env.token);
