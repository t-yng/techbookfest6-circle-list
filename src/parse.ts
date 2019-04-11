import * as fs from 'fs';
import * as _ from 'lodash';

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
    'Webサイト',
    '詳細ページ',
    'ジャンル詳細',
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

const main = () => {
  const json = fs.readFileSync(OFFICIAL_CIRCLE_LIST_FILE, 'utf-8');
  const officialCircleList = JSON.parse(json).list;

  const circles = _.map(officialCircleList, (circle) => {
    return {
      name: circle.name,
      penName: circle.penName,
      webSiteUrl: _.get(circle, 'webSiteURL', ''),
      DetailUrl: `https://techbookfest.org/event/tbf06/circle/${circle.id}`,
      genreFreeFormat: _.get(circle, 'genreFreeFormat', ''),
      spaces: circle.spaces.join(''),
    }
  });

  outputAsCsv(circles);
  outputAsJson(circles);
}

main();