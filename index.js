const {RTMClient} = require('@slack/rtm-api');
const token = 'xoxb-259311417568-788589402980-qUcte6hELlPQuUNBqCwRMUuQ';

const rtm = new RTMClient(token);

const axios = require('axios')




rtm.on('message',async (event) => {
	//console.log(event.user);
	try {
		
		const res = await axios.get('https://slack.com/api/users.info', { params: {
			token: 'xoxb-259311417568-788589402980-qUcte6hELlPQuUNBqCwRMUuQ',
			user: event.user
		} })

		console.log(res.user.real_name)
		
		if (event.text.includes("뒷풀이")){
			rtm.sendMessage("뒷풀이 불참 확인 완료하였습니다.", event.channel);
		}
		
		if (event.text.includes("세션") && !event.text.includes("특수")){
			rtm.sendMessage("세션 불참 확인 완료하였습니다. (일반결석)", event.channel);
		}
		
		else if (event.text.includes("세션") && event.text.includes("특수")){
			rtm.sendMessage("세션 불참 확인 완료하였습니다. (특수결석)", event.channel);
		}

	}catch (error){
		console.log('error', error)
	}
});

(async () => {
	await rtm.start();
})();
