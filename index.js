const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const app = express();
app.use(express.json());

const client = new line.Client(config);

// LINE Webhook 入口
app.post('/webhook', line.middleware(config), async (req, res) => {
  const events = req.body.events;
  await Promise.all(events.map(handleEvent));
  res.status(200).end();
});

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const text = event.message.text.trim();

  // 使用者說「我要預約」
  if (text === '我要預約') {
    const replyText =
      '預約說明：\n' +
      '1. 請回覆「今天」或「明天」選擇看診日期。\n' +
      '2. 再回覆「早診」或「晚診」選擇時段。\n\n' +
      '請先回覆：今天 / 明天';

    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyText,
    });
  }

  // 超簡化 Demo 後續對話
  if (text === '今天' || text === '明天') {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `已選擇${text}，請再回覆「早診」或「晚診」`,
    });
  }

  if (text === '早診' || text === '晚診') {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `預約成功：${text}（Demo：此處可寫入資料庫並排程提醒）`,
    });
  }

  // 其他訊息
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: '若要預約，請輸入「我要預約」。',
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
