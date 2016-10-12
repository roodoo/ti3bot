var Botkit = require('botkit')

var token = process.env.SLACK_TOKEN

var races_original = [
	"The Barony of Letnev",
	"The Clan of Saar",
	"The Emirates of Hacan",
	"The Federation of Sol",
	"The Mentak Coalition",
	"The Naalu Collective",
	"The Nekro Virus",
	"The Sardakk N’orr",
	"The Universities of Jol-Nar",
	"The Winnu",
	"The Xxcha Kingdom",
	"The Yssaril Tribes",
	"The Brotherhood of Yin",
	"The Embers of Muaat",
	"The Ghosts of Creuss",
	"The L1z1x Mindnet",
	"The Arborec"
  ]
var races = races_original
var currently_choosing
var current_choices = []
var number_of_choices = 3

var players = {}

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  console.log("cause there's this token" + token)
  controller.spawn({
    token: token,
    retry: Infinity
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['list races'], ['direct_mention','direct_message'], function (bot, message) {
  var reply = "Here are the currently available races:\n"
  races.forEach(function(item) { 
    reply += "* " + item + "\n";
  })
  bot.reply(message, reply);
})

controller.hears(['dig'], ['direct_mention'], function (bot, message) {
  var reply = "I heard " + message.match[0] + ".\n";
  reply += "Plus the 1 was " + message.match[1] + ".\n";
  reply += "So that's the text '" + message.text + "'.";
  userData = message.text.match(/<@([A-Z0-9]{9})>/);
  reply += "And the userdata is " + userData + ".";
  reply += "message user was " + message.user + ".";
  bot.reply(message, reply);
})

controller.hears(['add'], ['direct_mention'], function (bot, message) {
  var reply = "I heard add. text was " + message.text + ".";
  var userData = message.text.match(/<@([A-Z0-9]{9})>/);
  if (userData) {
		if (!players[userData]) {
			players[userData] = null;
			reply += "\nAdded @<" + userData + ">.";
		} else {
			reply += "@<" + userData + "> is already playing.";
		}
	} else {
	  reply += "\nBut there was no one to add ???";
	}
  bot.reply(message, reply);
})

controller.hears(['list players'], ['direct_mention'], function (bot, message) {
	var reply = "The players are:\n";
	for (var p in players) {
	  reply += " - " + p + " playing " + players[p] + "."
	}
	bot.reply(message, reply);
})

controller.hears(['hello', 'hi'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'Hello.')
})

controller.hears(['hello', 'hi'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Hello.')
  bot.reply(message, 'It\'s nice to talk to you directly.')
})

controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'You really do care about me. :heart:')
})

controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'I will respond to the following messages: \n' +
      '`bot hi` for a simple message.\n' +
      '`bot attachment` to see a Slack attachment message.\n' +
      '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
      '`bot help` to see this again.'
  bot.reply(message, help)
})

controller.hears(['attachment'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Beep Beep Boop is a ridiculously simple hosting platform for your Slackbots.'
  var attachments = [{
    fallback: text,
    pretext: 'We bring bots to life. :sunglasses: :thumbsup:',
    title: 'Host, deploy and share your bot in seconds.',
    image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
    title_link: 'https://beepboophq.com/',
    text: text,
    color: '#7CD197'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})
