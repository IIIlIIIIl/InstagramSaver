const Insta = require('@androz2091/insta.js');
const config = require('./config.json');
const djs = require('discord.js')
const logger = require('./logger')
const discordClient = new djs.Client();
let discordGuild;


const client = new Insta.Client(null);

client.login(config.username, config.password)
discordClient.login(config.discord.token).then(r => {
    logger.log(discordClient.user.username + " connected !", 'info');
    discordGuild = discordClient.guilds.cache.get(config.discord.guild);
    if(!discordGuild){
        logger.log("Guild not valid", "error")
    }
})

client.on('connected', () => {
    logger.log(`Instagram Saver used for ${client.user.username}`, 'info');
});

const send = function(channel, message) {
    const embed = new djs.MessageEmbed()
        .setAuthor(`💬 New message from @${message.author.username}`)
        .setFooter(`InstagramSaver by PasTrik#0657`);

    if(message.content){
        embed.setDescription(message.content)
    }

    if(message.mediaData && message.mediaData.url){
        embed.setImage(message.mediaData.url)
    }



    channel.send(embed);
}

client.on('messageCreate', (message) => {
    if(message.author.id === client.user.id) return;
    let category = discordGuild.channels.cache.find(c => c.type === "category" && c.name === "😏・InstagramSaver");
    if(!category) {
        discordGuild.channels.create("😏・InstagramSaver", { type: 'category'}).then(r => {
            category = r;
        })
    }

    console.log(category.id)

    const author = message.author.username.replace(/[^a-zA-Z ]/g, "");

    let channel = discordGuild.channels.cache.find(channel => channel.name === `📝・${author}` && channel.parent === category);
    if(!channel){
        discordGuild.channels.create(`📝・${author}`, { type: 'text', parent: category.id}).then(r => {
            channel = r;
            send(channel, message)
        })
    } else {
        send(channel, message)
    }

});