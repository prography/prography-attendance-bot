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

const readSheets = async (sheetName, range) => {
    const auth = getOAuth2Client();
    const sheets = google.sheets({ version: 'v4', auth })
    const spreadSheet = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!${range}`,
    })
    return spreadSheet
}

// 이름 컬럼만 가져오기
const readNameRows = async () => {
  const sheetName = 'test_sheet';
  const range = 'C6:C60';
  return readSheets(sheetName, range);
}

// 이름으로 인덱스 가져오기
const getIndexByName = async (name) => {
  const sheet = await readNameRows();
  return 6 + sheet.data.values.findIndex(value => value[0] === name)
}

// 값 쓰기
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
writeSheets('test_sheet', 'C11:C11', '임규산짱')