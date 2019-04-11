import * as fs from 'fs';
import * as request from 'request-promise';

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

(async () => {
  const promises = urls.map( (url) => request.get(url));
  const responses = await Promise.all(promises);

  // サークル情報から取り出したいデータのキー名の配列
  const circles = responses.reduce((acc: Array<Object>, res: string) => {
    const list = JSON.parse(res).list
    return acc.concat(list)
  }, []);

  const json = JSON.stringify({
    list: circles
  });

  fs.writeFileSync('circle-list.json', json);
})();