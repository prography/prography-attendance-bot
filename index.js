const {RTMClient} = require('@slack/client');
const token = process.env.SLACK_TOKEN || 'xoxb-498008364722-602282977333-Qf1K8EonzKmHdNDATPkSCgmr';
const rtm = new RTMClient(token);
rtm.start();

rtm.on('message',(message)=>{
	var text = message.text

	if(text.includes("납부")){
		rtm.sendMessage("성실한 납부 감사드립니다 :)", message.channel);
	}
});
