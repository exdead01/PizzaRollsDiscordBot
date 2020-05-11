const Discord = require('discord.js');
const fs = require('fs');
var JSONStream = require( "JSONStream" );
require('dotenv').config();
const client = new Discord.Client();
const jsonWriteTime = (2*60)*1000; //Minutes * seconds in a minute * milliseconds in a second

const TOKEN = process.env.BOT_TOKEN;

var t=setInterval(saveJSON,jsonWriteTime);

var SaveInProgress = 0;

//var User_History =[];

// Constructors

function User(id)
{
    this.id = id;
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
    try
    {
        console.log('Reading users_words.json...');
        User_History = JSON.parse(fs.readFileSync('users_words.json')); //if file exists
        console.log('Read!');
    }
    catch(err)
    {
        console.error(err);
        console.warn('File does not exist, creating...');
        try
        {
            //trying to create file
            fs.writeFileSync('users_words.json', JSON.stringify([]));
            User_History = [];
            console.log('Created!');
        }
        catch(err)
        {
            //if you cannot write it
            console.error(err);
            console.error('Could not load or create file!');
            throw new Error('Exiting...');
        }
    }
})

client.on('message', msg=>{
    if(msg.author.tag != client.user.tag)
    {
        words = msg.content.split(" ");
        if(words[0] == "!matchme")
        {
            msg.channel.send('Please Wait, <@' + msg.author.id + '>');
            msg.channel.send(matchMe(msg.author.id, msg.guild.id));
        }
        else
        {
            for(var i=0; i<words.length; i++)
            {
                var inArray = isInArray(msg.author.id);
                if(!inArray[0])
                {
                    var newUser = new User(msg.author.id);
                    var newWord = new Word(words[i]);
                    newUser.dict.push(newWord)
                    User_History.push(newUser)
                }
                else
                {
                    for(var j=0; j<User_History[inArray[1]].dict.length; j++)
                    {

                        if(User_History[inArray[1]].dict[j].word == words[i])
                        {
                            //if the word alreasy exists
                            User_History[inArray[1]].dict[j].times++;
                            break;
                        }
                        else if(j==User_History[inArray[1]].dict.length-1)
                        {
                            //if the word doesnt exist and we're also at the end
                            User_History[inArray[1]].dict.push(new Word(words[i]));
                            break;
                        }
                    }
                }
            }
        }
    }
})

function isInArray(id)
{
    if(typeof(id) != "string")
    {
        console.warn("isInArray(id): id is not a string!")
        return [0,0];
    }
    else
    {
        for(var i=0; i<User_History.length; i++)
        {
            if(User_History[i].id == id)
            {
                return [1,i];
            }
        }
        return [0,0];
    }
}

function matchMe(id, guildid)
{
    //Ok, we need to cycle through all the words in id's dictionary, and compare them to the dictionaries of all the users in the same guild.
    //A score will be generated based on how many similar times (the difference of times between the same words) between each user.
    //No sorting is required.- We must sort the scores at the end.
    //Get scaled word.times with words[0].times/words[i].times

    //average(id.dict.words[].times/user.dict.words[].times)<<<< order users by their absolute distance to 1

    var inArray = isInArray(id);
    if(inArray[0]==0)
    {
        return "No matches yet, <@" + id + ">";
    }
    else
    {
        var list = client.guilds.cache.get(guildid); 

        var UserList = [];

        list.members.cache.forEach(member =>
            {
                var otherInArray = isInArray(member.id);
                if(otherInArray[0])
                {
                    var mostUsedWord = 0;
                    for(var i=0; i<User_History[otherInArray[1]].length-1; i++)
                    {

                    }
                }
                console.log(member.id);
            });

        return "";
    }
}

function saveJSON()
{
    if(SaveInProgress == 0)
    {
        SaveInProgress = 1;
        console.log('Start Writing JSON!');
        try
        {
        //fs.writeFile('users_words.json', User_History);
        fs.renameSync('users_words.json', 'users_words.json.bak');
        var transformStream = JSONStream.stringify();
        var outputStream = fs.createWriteStream("./users_words.json");
        transformStream.pipe(outputStream);
        User_History.forEach(transformStream.write);
        transformStream.end();
        }
        catch
        {
            console.error(err);
            console.error('Could not write backup!');
            throw new Error('Exiting...');
        }
        SaveInProgress = 0;
        console.log('Finished!');
    }
}


