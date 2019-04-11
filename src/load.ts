import * as fs from 'fs';
import * as request from 'request-promise';
import * as _ from 'lodash';

// サークルリストを取得するAPIのURL一覧
// WARNING: URLのクエリパラメータの値は変更される可能性あり
const urls = [
  'https://techbookfest.org/api/circle?eventID=tbf06&eventExhibitCourceID=4&visibility=site&limit=100&onlyAdoption=true',
  'https://techbookfest.org/api/circle?eventID=tbf06&eventExhibitCourceID=3&visibility=site&limit=100&onlyAdoption=true',
  'https://techbookfest.org/api/circle?eventID=tbf06&visibility=site&limit=100&onlyAdoption=true',
  'https://techbookfest.org/api/circle?eventID=tbf06&visibility=site&limit=100&onlyAdoption=true&cursor=CkIKEQoGU3BhY2VzEgcaBeOBhjY3EilqC2J-dGJmLXRva3lvchoLEhFDaXJjbGVFeGhpYml0SW5mbxj3opsiDBgAIAA',
  'https://techbookfest.org/api/circle?eventID=tbf06&visibility=site&limit=100&onlyAdoption=true&cursor=CkIKEQoGU3BhY2VzEgcaBeOBizEwEilqC2J-dGJmLXRva3lvchoLEhFDaXJjbGVFeGhpYml0SW5mbxix2aQSDBgAIAA',
  'https://techbookfest.org/api/circle?eventID=tbf06&visibility=site&limit=100&onlyAdoption=true&cursor=CkIKEQoGU3BhY2VzEgcaBeOBjTMxEilqC2J-dGJmLXRva3lvchoLEhFDaXJjbGVFeGhpYml0SW5mbxjSjJshDBgAIAA',
  'https://techbookfest.org/api/circle?eventID=tbf06&visibility=site&limit=100&onlyAdoption=true&cursor=CkIKEQoGU3BhY2VzEgcaBeOBkTcxEilqC2J-dGJmLXRva3lvchoLEhFDaXJjbGVFeGhpYml0SW5mbxikl5cVDBgAIAA',
];

const OUTPUT_FILE = 'data/circle-list-official.json';

(async () => {
  const promises = urls.map( (url) => request.get(url));
  const responses = await Promise.all(promises);

  const circles = _.chain(responses)
                   .reduce((acc, res: string) => {
                      const list = JSON.parse(res).list
                      return acc.concat(list)
                   }, [])
                   .uniqBy('id')
                   .values();

  const json = JSON.stringify({
    list: circles
  });

  fs.writeFileSync(OUTPUT_FILE, json);
})();