var Handlebars = require('handlebars');
var testInput = [
  {
    "cardId": "EX1_572",
    "name": "Ysera",
    "cardSet": "Classic",
    "type": "Minion",
    "faction": "Neutral",
    "rarity": "Legendary",
    "cost": 9,
    "attack": 4,
    "health": 12,
    "text": "At the end of your turn, add a Dream Card to your hand.",
    "flavor": "Ysera rules the Emerald Dream.  Which is some kind of green-mirror-version of the real world, or something?",
    "artist": "Gabor Szikszai",
    "collectible": true,
    "elite": true,
    "race": "Dragon",
    "img": "http://wow.zamimg.com/images/hearthstone/cards/enus/original/EX1_572.png",
    "imgGold": "http://wow.zamimg.com/images/hearthstone/cards/enus/animated/EX1_572_premium.gif",
    "locale": "enUS"
  }
];
var input = testInput[0];
var format = "<p>{{name}}</p>";
var template = Handlebars.compile(format)
console.log(template(input))