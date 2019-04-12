import * as fs from 'fs';
import * as util from 'util';
import * as _ from 'lodash';
import { builder, Tokenizer, IpadicFeatures } from 'kuromoji'
// import * as kuromoji from 'kuromoji';

// type Tokenizer<T> = kuromoji.Tokenizer<T>;

const OFFICIAL_CIRCLE_LIST_FILE = 'data/circle-list-official.json';
const OUTPUT_CSV = 'data/circle-list.csv';
const OUTPUT_JSON = 'data/circle-list.json';

type Circle = {
  [key: string]: string
}

const encloseTextBySymbol = (symbol: string) => (text: string) => `${symbol}${text}${symbol}`;

const outputAsCsv = (circles: Array<Circle>, path: string = OUTPUT_CSV) => {
  const columns = [
    'サークル名',
    '著者',
    'ジャンル詳細',
    'キーワード',
    '詳細ページ',
    'Webサイト',
    '設営場所',
  ];
  const encloseTextByQuotation = encloseTextBySymbol('"');
  const values = _.map(circles, (circle) => _.values(circle).map(encloseTextByQuotation));
  const csv = [columns, values.join("\n")].join("\n");
  fs.writeFileSync(path, csv);
}

const outputAsJson = (circles: Array<Circle>, path: string = OUTPUT_JSON) => {
  const json = JSON.stringify({circles});
  fs.writeFileSync(path, json);
}

const pickKeywords = (tokenizer: Tokenizer<IpadicFeatures>, text: string) => {
  const tokens = tokenizer.tokenize(text);

  const keywords = _.chain(tokens)
                    .filter((token) => token.pos === '名詞' && token.word_type === 'UNKNOWN')
                    .map((token) => token.surface_form)
                    .filter((keyword) => !/(^[!-\/:-@\[-`{-~]+$|^\d+$)/.test(keyword)) // 半角記号のみ、数字のみを排除
                    .uniq() // 重複を排除
                    .sort()
                    .value();
  return keywords;
}

const main = () => {

  const tokenizerBuilder = builder({
    dicPath: 'node_modules/kuromoji/dict'
  });

  tokenizerBuilder.build((err, tokenizer) => {
    if(err) throw err;

    const json = fs.readFileSync(OFFICIAL_CIRCLE_LIST_FILE, 'utf-8');
    const officialCircleList = JSON.parse(json).list;

    const circles = _.map(officialCircleList, (circle) => {
      const genreFreeFormat = _.get(circle, 'genreFreeFormat', '');

      return {
        name: circle.name,
        penName: circle.penName,
        genreFreeFormat: genreFreeFormat,
        keywords: pickKeywords(tokenizer, genreFreeFormat).join(','),
        DetailUrl: `https://techbookfest.org/event/tbf06/circle/${circle.id}`,
        webSiteUrl: _.get(circle, 'webSiteURL', ''),
        spaces: circle.spaces.join(', '),
      }
    });

    outputAsCsv(circles);
    outputAsJson(circles);
  })
}

main();
