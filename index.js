const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();

const TOKEN = process.env.BOT_TOKEN;

var User_History =[];

// Constructors

function User(tag)
{
    this.tag = tag;
    this.dict = [];
}
function Word(word)
{
    this.word = word;
    this.times = 1; // the times this word has been used
}



// End of Constructors


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
            var inArray = isInArray(msg.author.tag);
            if(!inArray[0])
            {
                msg.channel.send("no u");
            }
            else
            {
                msg.channel.send('No matches, ' + User_History[inArray[1]].tag);
            }
        }
        else
        {
            for(var i=0; i<words.length; i++)
            {
                var inArray = isInArray(msg.author.tag);
                if(!inArray[0])
                {
                    var newUser = new User(msg.author.tag);
                    console.log('Adding new user: '+ newUser.tag);
                    newUser.dict.push(words[i])
                    User_History.push(newUser)
                }
                else
                {
                    //This needs to be more complicated.
                    //User_History[inArray[1]].dict.push(words[i]);
                    console.log("Adding word!");
                }
            }
        }
    }
    console.log(msg.author.tag + ": " + msg.content);
    //for(var i=0; i<User_History.length; i++)
    //{
    //    console.log(User_History[i].name);
    //}
    console.log('Array length: '+ User_History.length);
})

function isInArray(tag)
{
    if(typeof(tag) != "string")
    {

        return [0,0];
    }
    else
    {
        for(var i=0; i<User_History.length; i++)
        {
            if(User_History[i].tag == tag)
            {
                return [1,i];
            }
        }
        return [0,0];
    }
}
