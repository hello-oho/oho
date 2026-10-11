/** OHO lead collector: deploy as Web App (Execute as me; Anyone access). */
const SHEET_NAME='Website Leads';
const HEADERS=['Timestamp','Lead ID','Name','Business','Email','Phone','Service','Budget','Message','Source URL','Status','Assigned To','Follow-up Date'];
function doPost(e){
  const lock=LockService.getScriptLock();
  try{
    if(!e || !e.postData || !e.postData.contents) throw Error('Empty request');
    if(e.postData.contents.length>12000) throw Error('Payload too large');
    const d=JSON.parse(e.postData.contents);
    if(d.honeypot) return ContentService.createTextOutput('OK');
    const clean=(v,max)=>String(v||'').trim().slice(0,max).replace(/^[=+@\-]/, m => String.fromCharCode(39) + m);
    const name=clean(d.name,90),business=clean(d.business,120),phone=clean(d.phone,24),service=clean(d.service,100),message=clean(d.message,2000);
    if(!name||!business||!service||!message||!/^\+?[0-9 ()-]{8,24}$/.test(phone))throw Error('Invalid lead');
    lock.waitLock(15000);
    const ss=SpreadsheetApp.getActiveSpreadsheet();
    if(!ss)throw Error('Bind this script to a Google Sheet');
    let sheet=ss.getSheetByName(SHEET_NAME);if(!sheet)sheet=ss.insertSheet(SHEET_NAME);
    if(sheet.getLastRow()===0){sheet.appendRow(HEADERS);sheet.setFrozenRows(1)}
    const id=Utilities.getUuid();const row=sheet.getLastRow()+1;
    sheet.getRange(row,6).setNumberFormat('@');
    sheet.getRange(row,1,1,HEADERS.length).setValues([[new Date(),id,name,business,clean(d.email,150),phone,service,clean(d.budget,100),message,clean(d.source,500),'New','','']]);
    return ContentService.createTextOutput('OK');
  }catch(err){console.error(err);return ContentService.createTextOutput('ERROR')}finally{if(lock.hasLock())lock.releaseLock()}
}
