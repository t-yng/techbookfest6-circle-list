import * as request from 'request-promise';
import cheerio from 'cheerio';

(async () => {
  const body = await request.get('https://yosuke-furukawa.hatenablog.com/entry/2017/05/10/101752');
  const $ = cheerio.load(body);
})();