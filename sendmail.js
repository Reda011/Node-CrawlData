const nodemailer = require('nodemailer');
/* const utils = require('utility');
const fs = require('fs');
const path = require('path'); */
// 参照 https://blog.csdn.net/findhappy117/article/details/79841398

var transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: '782669139@qq.com',
    pass: 'uvadtxqhtmaqbeag'
  }
});

var mailOption = {
  from: '782669139@qq.com',
  to: '2054479799@qq.com, 984024975@qq.com',
  subject: '测试-群发电影天堂数据',
  html: ``,
  attachments: [
    {
      filename: 'test.jpeg',
      prht: './movie_doc/WechatIMG2.jpeg'
    },
    {
      filename: 'ftp.txt',
      path: './movie_doc/dy.txt'
    }
  ]
}

transporter.sendMail(mailOption, (err,res) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('发送成功');
})
