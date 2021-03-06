const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const getOAuth2Client = () => {
  const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'credentials.json')))
  const token = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'token.json')))
  const oAuth2Client = new google.auth.OAuth2(
    credentials.web.client_id,
    credentials.web.client_secrent,
    credentials.web.redirect_uris[0],
  )
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

const spreadsheetId = '1L_5VyesPX86yxxr0-zwT3BigWOLEklBc2hTTN31pTiU';
const targetSheetName = 'test_sheet';

/**
 * 시트 내용 가져오기
 * @param {string} sheetName 시트이름
 * @param {string} range 가져올 내용 범위
 */
const readSheets = async (sheetName, range) => {
    const auth = getOAuth2Client();
    const sheets = google.sheets({ version: 'v4', auth })
    const spreadSheet = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!${range}`,
    })
    return spreadSheet
}

/**
 * 이름 컬럼만 가져오기, 위치가 딱 저 위치임
 */
const readNameRows = async () => {
  const sheetName = targetSheetName;
  const range = 'C6:C60';
  return readSheets(sheetName, range);
}

/**
 * 이름으로 인덱스 넘버 가져오기
 * @param {string} name 이름
 */
const getIndexByName = async (name) => {
  const sheet = await readNameRows();
  return 6 + sheet.data.values.findIndex(value => value[0] === name)
}

/**
 * 날짜가 있는 컬럼을 리턴, 해당 날짜의 가장 왼쪽 컬럼을 반환한다.
 * @param {string} date 2019.10.05
 */
const getColIndexByDate = async (date) => {
  const sheet = await readSheets(targetSheetName, 'M1:FE1');
  const colIdx = sheet.data.values[0].findIndex(col => new RegExp(date).test(col));
  return 13 + colIdx;
}

/**
 * 숫자를 넣으면 알파벳진수(26진수 를 알파벳으로 맵핑)를 반환한다.
 * @param {number} num 
 */
const getColIdByNumber = (num) => {
  let current = num;
  let result = [];
  while (current > 26) {
    const mod = current % 26;
    const div = Math.floor(current / 26);
    current = div;
    result.push(mod);
  }
  result.push(current)
  return result.reverse().map(digit => String.fromCharCode(64 + digit)).join('');
}

/**
 * 시트에 값을 쓴다.
 * @param {string} sheetName 
 * @param {string} range 
 * @param {any} value 
 */
const writeSheets = async (sheetName, range, value) => {
   const auth = getOAuth2Client();
   const sheets = google.sheets({
     version: 'v4',
     auth
   })
   await sheets.spreadsheets.values.update({
     spreadsheetId,
     range: `${sheetName}!${range}`,
     valueInputOption: 'RAW',
     resource: {
       values: [
         [value]
       ]
     }
   })
}

// getIndexByName('조성만').then((idx) => console.log(idx))
// writeSheets('test_sheet', 'C11:C11', '임규산짱')
// getColIndexByDate('2019.10.05').then((res) => console.log(res));

// 알파벳 진수 테스트
// console.log(getColIdByNumber(13));
// console.log(getColIdByNumber(27));
// console.log(getColIdByNumber(54));
// console.log(getColIdByNumber(120));
exports.default = {
  readSheets,
  readNameRows,
  getIndexByName,
  writeSheets,
  getColIndexByDate,
  getColIdByNumber
}
