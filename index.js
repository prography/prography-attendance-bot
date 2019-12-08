const {RTMClient} = require('@slack/client');
const token = process.env.SLACK_TOKEN || 'xoxb-259311417568-788589402980-TTySjkE9YyNeRh5G2nBvvTjO';

const rtm = new RTMClient(token);
rtm.start();

rtm.on('message',(message)=>{
	
	var text = message.text
	var user = message.user
	
	if(text.includes("뒷풀이")){
		rtm.sendMessage("<@${event.user}> 뒷풀이 불참 확인 완료하였습니다.", message.channel);
	}

	if(text.includes("세션") && text.includes("특수")){
		rtm.sendMessage("세션 불참 확인 완료하였습니다 (특수결석).", message.channel);
	}

	else if(text.includes("세션") && !text.includes("특수")){
		rtm.sendMessage("세션 불참 확인 완료하였습니다 (일반결석).", message.channel);
	}
});
