const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};


const app = express();

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
return client.replyMessage(event.replyToken, {
      type: 'flex',
      altText: '預約說明',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '預約說明',
              weight: 'bold',
              size: 'xl',
              margin: 'md'
            },
            {
              type: 'separator',
              margin: 'xxl'
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'xxl',
              spacing: 'sm',
              contents: [
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '✓',
                      size: 'sm',
                      color: '#00B900',
                      flex: 0
                    },
                    {
                      type: 'text',
                      text: '如網路預約額滿，可直接至現場掛號',
                      size: 'sm',
                      color: '#555555',
                      flex: 1,
                      margin: 'sm'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '✓',
                      size: 'sm',
                      color: '#00B900',
                      flex: 0
                    },
                    {
                      type: 'text',
                      text: '若需快速領取或埋線，請洽詢診間護理師協助',
                      size: 'sm',
                      color: '#555555',
                      flex: 1,
                      margin: 'sm',
                      wrap: true
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '✓',
                      size: 'sm',
                      color: '#00B900',
                      flex: 0
                    },
                    {
                      type: 'text',
                      text: '請回傳「今天」或「明天」選擇看診日期',
                      size: 'sm',
                      color: '#555555',
                      flex: 1,
                      margin: 'sm',
                      wrap: true
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '✓',
                      size: 'sm',
                      color: '#00B900',
                      flex: 0
                    },
                    {
                      type: 'text',
                      text: '再回傳「早診」或「晚診」選擇診段',
                      size: 'sm',
                      color: '#555555',
                      flex: 1,
                      margin: 'sm',
                      wrap: true
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '✓',
                      size: 'sm',
                      color: '#00B900',
                      flex: 0
                    },
                    {
                      type: 'text',
                      text: '預先回覆：今天／明天',
                      size: 'sm',
                      color: '#555555',
                      flex: 1,
                      margin: 'sm'
                    }
                  ]
                }
              ]
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              style: 'primary',
              height: 'sm',
              action: {
                type: 'message',
                label: '開始預約',
                text: '今天'
              }
            }
          ],
          flex: 0
        }
      }
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
