const {RTMClient} = require('@slack/rtm-api');
const token = 'xoxb-259311417568-788589402980-qUcte6hELlPQuUNBqCwRMUuQ';

const rtm = new RTMClient(token);

rtm.on('message',async (event) => {
	try {
		if (event.text.includes("뒷풀이")){
			rtm.sendMessage("뒷풀이 불참 확인 완료하였습니다.", event.message.channel);
		}
		
		if (event.text.includes("세션") && !event.text.includes("특수")){
			rtm.sendMessage("세션 불참 확인 완료하였습니다. (일반결석)", event.message.channel);
		}
		
		else if (event.text.includes("세션") && event.text.includes("특수")){
			rtm.sendMessage("세션 불참 확인 완료하였습니다. (특수결석)", event.message.channel);
		}

	}catch (error){
		console.log('error', error)
	}
});

(async () => {
	await rtm.start();
})();
