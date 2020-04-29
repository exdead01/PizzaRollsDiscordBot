const Discord = require('discord.js');
const fs = require('fs');
var JSONStream = require( "JSONStream" );
require('dotenv').config();
const client = new Discord.Client();
const jsonWriteTime = (.5*60)*1000; //Minutes * seconds in a minute * milliseconds in a second

const TOKEN = process.env.BOT_TOKEN;

var t=setInterval(saveJSON,jsonWriteTime);

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
            msg.channel.send(matchMe(msg.author.id));
        }
        // else if(words[0] == "!readme")
        // {
        //     var inArray = isInArray(msg.author.id);
        //     if(!inArray[0])
        //     {
        //         msg.channel.send("no u");
        //     }
        //     else
        //     {
        //         for(var i=0;i<User_History[inArray[1]].dict.length;i++)
        //         {
        //             msg.channel.send(User_History[inArray[1]].dict[i]);
        //         }
        //     }
        // }
        else
        {
            for(var i=0; i<words.length; i++)
            {
                console.log('Word: ' + words[i]);
                var inArray = isInArray(msg.author.id);
                if(!inArray[0])
                {
                    var newUser = new User(msg.author.id);
                    console.log('Adding new user: '+ newUser.id);
                    newUser.dict.push(words[i])
                    User_History.push(newUser)
                }
                else
                {
                    console.log("Changing/Adding word!");
                    for(var j=0; j<User_History[inArray[1]].dict.length; j++)
                    {
                        console.log(User_History[inArray[1]].dict[j] + ": :" + words[i]);
                        console.log(User_History[inArray[1]].dict.length + ": :" + words.length);

                        if(User_History[inArray[1]].dict[j] == words[i])
                        {
                            //if the word alreasy exists
                            User_History[inArray[1]].dict[j].times++;
                            console.log("Increase words number");
                            break;
                        }
                        else if(j==User_History[inArray[1]].dict.length-1)
                        {
                            //if the word doesnt exist and we're also at the end
                            User_History[inArray[1]].dict.push(words[i]);
                            console.log("!!!!add word!!!!!");
                            break;
                        }
                    }
                }
            }
        }
    }
    console.log(msg.author.id + ": " + msg.content);
    //for(var i=0; i<User_History.length; i++)
    //{
    //    console.log(User_History[i].name);
    //}
    //console.log('User Array length: '+ User_History.length);
    //console.log('Word Array length: '+ User_History[0].dict.length);
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

function matchMe(id)
{
    if(isInArray(id)[0]==0)
    {
        return "No matches yet, <@" + id + ">";
    }
    return "Error: End of matchMe(" + id + ")";
}

function saveJSON()
{
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
}


