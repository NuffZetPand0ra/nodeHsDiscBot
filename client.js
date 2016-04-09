require('dotenv').config();
var DiscordClient = require('discord.io')
  , unirest = require('unirest')
  , Handlebars = require('handlebars')
  , md = require('html-md');
  ;
var bot = new DiscordClient({
    autorun: true,
    email: process.env.DISCORD_EMAIL,
    password: process.env.DISCORD_PWD,
    //OR
    token: ""
});
var responseMessages = [
		{
			"type":"Minion"
		  , "template":"\n"
			  + "**{{name}}**\n"
			  + "{{rarity}} {{#if playerClass}}{{playerClass}} {{/if}}{{type}} from the {{cardSet}} set\n"
			  + "Cost: {{cost}} mana\n"
			  + "Attack: {{attack}}  Health: {{health}}\n"
			  + "{{#if text}}Card text: {{{text}}}\n{{/if}}"
			  + "{{img}}"
		}
	  , {
			"type":"Spell"
		  , "template":"\n"
			  + "**{{name}}**\n"
			  + "{{rarity}} {{#if playerClass}}{{playerClass}} {{/if}}{{type}} from the {{cardSet}} set\n"
			  + "Cost: {{cost}} mana\n"
			  + "Card text: {{text}}\n"
			  + "{{img}}"
		}
	  , {
			"type":"Weapon"
		  , "template":"\n"
			  + "**{{name}}**\n"
			  + "{{rarity}} {{#if playerClass}}{{playerClass}} {{/if}}{{type}} from the {{cardSet}} set\n"
			  + "Cost: {{cost}} mana\n"
				+ "Attack: {{attack}}  Durability: {{durability}}"
			  + "{{#if text}}Card text: {{{text}}}\n{{/if}}"
			  + "{{img}}"
		}
	]
  , templates = {};
for(var i=0; i<responseMessages.length; i++){
	templates[responseMessages[i].type] = Handlebars.compile(responseMessages[i].template)
	// console.log(responseMessages[i])
	// templates[responseMessages[i].type] = "Hej!"
}
// console.log(templates);

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");
});

bot.on('message', function(user, userID, channelID, message, rawEvent) {
	var search
	  , cardnamePattern = /\[([A-Za-z0-9 \'\.]+)\]/
	  ;
    if (message === "ping") {
        bot.sendMessage({
            to: channelID,
            message: "HELLO! HELLO! HELLO!"
        });
    }else if(search = message.match(cardnamePattern)){
		// These code snippets use an open-source library. http://unirest.io/nodejs
		var searchUri = encodeURIComponent(search[1]);
		unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/"+searchUri)
		.header("X-Mashape-Key", "zMbSuxAxzmmsh7sUk74MHMDOEXMzp1G5eYNjsnCWLWcwTHmcQE")
		.header("Accept", "application/json")
		.end(function (result) {
			console.log(user+" requested info on \""+searchUri+"\"", result.body);
			if(result.body.error == 404 && result.body.message == "Card not found."){
				bot.sendMessage({
					to: channelID,
					message: "No card found!"
				});	
			}else{
				for(var i=0; i<result.body.length; i++){
					if(result.body[i].type == "Minion" || result.body[i].type == "Spell" || result.body[i].type == "Weapon"){
						bot.sendMessage({
							to: channelID,
							message: templates[result.body[i].type](result.body[i])
						});		
					}
				}
			}
		});
	}
});
