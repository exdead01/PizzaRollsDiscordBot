const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();

const TOKEN = process.env.BOT_TOKEN;

var User_History =[];

client.login(TOKEN);

client.on('ready', () =>{
    console.log('Logged in as ' + client.user.tag + '\n');
})

client.on('message', msg=>{
    if(msg.author.tag != client.user.tag)
    {
        words = msg.content.split(" ");
        if(words[0] == "!matchme")
        {
            //match or give a list of matches
        }
        else
        {
            
        }
    }
    console.log(msg.author.tag + ": " + msg.content);
})
