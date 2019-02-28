// 参照 http://www.demodashi.com/demo/12368.html
const app = require('express')();
const cheerio = require('cheerio');
const superagent = require('superagent');
require('superagent-charset')(superagent);
const fs = require('fs')
const path = require('path');

const port = 3001;


app.get('/', (req,res) => {
  var url_data = [];
    var img_url = 'https://raw.githubusercontent.com/huainanhai/EXE/master/sevenDay/doc/wz.jpg';
    fs.readFile(path.join(__dirname, './movie_doc', 'dy.txt'), 'utf-8', (err, data) => {
        if (err) throw err;
        url_data = data.split('\n').filter(function (n) {
            return n != '';
        });
        var str = '<div style="width:50%;">';
        str += '<h4 style="padding-left:10px;">(温馨提示：复制ftp开头的路径到‘迅雷极速版’（邮件附件里面有）就会自动下载电影了, 最新免费电影节目单不定时更新，福利呦)</h4>'
        item.forEach(m => {
            str += '<h3 style="padding-left:10px;">' + m.name + '</h3>';
            m.data.forEach((n) => {
                url_data.forEach(j => {
                    var name = j.split('~~')[0];
                    name = name.split('.')[0];
                    if (n.title.indexOf(name) > -1) {
                        n.download_url = j.split('~~')[1];
                    }
                });
                str += '<div style="">' +
                    '<a href="' + n.href + '" style="height:30px;display:inline-block;vertical-align: middle;text-decoration:none;margin-left:6px;" target="_blank">' + n.title + '</a>' +
                    '<span style="height:30px;display:inline-block;vertical-align: middle;color: red;float:right;">' + n.date + '</span>' +
                    '</div>';
                str += '<div style="background:#fdfddf;border:1px solid #ccc;padding:3px 10px;margin-bottom:10px;">' + n.download_url + '</div>';
            });
        });
        str += '<img src="' + img_url + '" width="540" height="748" />';
        str += '</div>';
        res.send(str);
    })
});

/* fs.writeFile(path.join(__dirname, './movie_doc', 'dy.txt'), 'helloWorld', function (e) {
  console.log(e);
  fs.readFile(path.join(__dirname, './movie_doc', 'dy.txt'), 'utf-8', function(err, data) {
    if (err) {
        throw err;
    }
    console.log(data);
  });
}); */

var item = [];
function getMovies() {
  item = [];
  var url = 'http://www.dytt8.net';
  superagent.get(url + '/index.htm').charset().end((err, sres) => {
      if (err) {
          throw err;
      }
      var $ = cheerio.load(sres.text);
      $('.bd3rl .co_area2').each(function (i, n) {
          if (i > 1) return;
          var $n = $(n);
          var obj = {
              name: $n.find('.title_all strong').text(),
              data: []
          };
          $n.find('tr').each(function (i, m) {
              var $m = $(m);
              var childUrl = url + $m.find('.inddline').eq(0).find('a').eq(1).attr('href');
              obj.data.push({
                  title: $m.find('.inddline').eq(0).text(),
                  href: url + $m.find('.inddline').eq(0).find('a').eq(1).attr('href'),
                  date: $m.find('.inddline').eq(1).text(),
                  download_url: ''
              });
          });
          item.push(obj);
      });
      fs.writeFile(path.join(__dirname, './movie_doc', 'dy.txt'), '', function (e) { });
      item.shift();
      item.forEach(n => {
          n.data.forEach((m, i) => {
              superagent.get(m.href).charset().end((err, cres) => {
                  var _$ = cheerio.load(cres.text);
                  var download_url = _$('#Zoom table a').text();
                  var title = _$('.bd3r .title_all').text();
                  title = title.substring(title.indexOf('《') + 1, title.indexOf('》'));
                  // console.log(title)
                  var total_movie = title + '~~' + download_url + '\n';
                  // var total_movie = download_url.split(']')[1].substr(1) + '~~' + download_url + '\n';
                  var buff = new Buffer(total_movie);
                  fs.appendFile(path.join(__dirname, './movie_doc', 'dy.txt'), buff, function (e) { });
              });
          });
      });
  });
};

getMovies();

app.listen(port, () => {
  console.log('listening part on', port);
});
