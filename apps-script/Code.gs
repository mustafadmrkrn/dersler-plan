/**
 * Ders Defteri köprüsü
 *
 * Bu kod, "Ders Defteri" Google tablosuna bağlı Apps Script içindir.
 * Uygulama ile tablo arasında veri taşır. Tablo senin Google Drive'ında durur.
 * KURULUM: Uzantılar > Apps Script > bu kodun tamamını yapıştır > Dağıt > Yeni dağıtım > Web uygulaması
 *          Şu kişi olarak çalıştır: Ben. Erişimi olanlar: Herkes. Çıkan adresi uygulamaya yapıştır.
 */
var KEY = 'BURAYA-KENDI-GIZLI-ANAHTARINI-YAZ';

var SHEETS = {students: 'Öğrenciler', lessons: 'Dersler', meta: 'Ayarlar'};
var HEAD_S = ['Kimlik', 'Ad', 'Tür', 'Gün', 'Saat', 'Ücret', 'Tekrar', 'Aktif'];
var HEAD_L = ['Kimlik', 'Öğrenci kimliği', 'Öğrenci', 'Tarih', 'Saat', 'Durum', 'Konu', 'Yorum', 'Ücret', 'Ödendi', 'Ödeme tarihi', 'Ertelendiği tarih'];
var DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
var STAT = {planned: 'Planlı', done: 'Yapıldı', missed: 'İptal'};
var REP = {'1': 'Her hafta', '2': 'İki haftada bir', '0': 'Tek seferlik'};
var SEED = {students: [], lessons: [], theme: 'tablo'};

function doPost(e) {
  var b = {};
  try { b = JSON.parse(e.postData.contents); } catch (x) {}
  return handle_(b);
}
function doGet(e) { return handle_((e && e.parameter) || {}); }
function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function handle_(p) {
  if (!p || p.key !== KEY) return out_({ok: false, error: 'auth'});
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ensure_(ss);
    var cur = read_(ss), hash = hash_(cur);
    if (p.action === 'save') {
      if (p.baseHash !== hash) return out_({ok: false, conflict: true, state: cur, hash: hash});
      write_(ss, p.state);
      return out_({ok: true, hash: hash_(read_(ss))});
    }
    return out_({ok: true, state: cur, hash: hash});
  } catch (err) {
    return out_({ok: false, error: String(err)});
  } finally {
    lock.releaseLock();
  }
}

function hash_(o) {
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, JSON.stringify(o)));
}

function ensure_(ss) {
  var made = false;
  [['students', HEAD_S], ['lessons', HEAD_L], ['meta', ['Ayar', 'Değer']]].forEach(function (x) {
    var sh = ss.getSheetByName(SHEETS[x[0]]);
    if (!sh) {
      sh = ss.insertSheet(SHEETS[x[0]]);
      made = true;
    }
    if (sh.getLastRow() < 1) {
      sh.getRange(1, 1, 1, x[1].length).setValues([x[1]]).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
  });
  ss.getSheetByName(SHEETS.students).getRange('E:E').setNumberFormat('@');
  var l = ss.getSheetByName(SHEETS.lessons);
  l.getRange('D:E').setNumberFormat('@');
  l.getRange('K:L').setNumberFormat('@');
  var meta = ss.getSheetByName(SHEETS.meta);
  if (meta.getLastRow() < 3) {
    meta.getRange(2, 1, 2, 2).setValues([['Tema', 'tablo'], ['Başlangıç verisi yüklendi', 'Hayır']]);
  }
  if (meta.getRange(3, 2).getValue() !== 'Evet') {
    var st = ss.getSheetByName(SHEETS.students);
    if (st.getLastRow() < 2) write_(ss, SEED);
    meta.getRange(3, 2).setValue('Evet');
  }
  if (made) {
    var first = ss.getSheets()[0];
    if (first && ['Sayfa1', 'Sheet1'].indexOf(first.getName()) >= 0 && ss.getSheets().length > 1) {
      try { ss.deleteSheet(first); } catch (x) {}
    }
  }
}

function fill_(sh, rows, ncols) {
  var last = sh.getLastRow();
  if (last > 1) sh.getRange(2, 1, last - 1, ncols).clearContent();
  if (rows.length) sh.getRange(2, 1, rows.length, ncols).setValues(rows);
}

function write_(ss, state) {
  var s = state || {};
  var st = s.students || [], ls = s.lessons || [];
  var names = {};
  st.forEach(function (x) { names[x.id] = x.name; });
  var srows = st.map(function (x) {
    return [x.id, x.name, x.cat, x.day >= 0 ? DAYS[x.day] : 'Düzensiz', x.time || '', Number(x.fee) || 0,
      REP[String(x.interval)] || REP['1'], x.active ? 'Evet' : 'Hayır'];
  });
  var lrows = ls.slice().sort(function (a, b) {
    return (a.date + ' ' + (a.time || '')) < (b.date + ' ' + (b.time || '')) ? -1 : 1;
  }).map(function (l) {
    return [l.id, l.sid, names[l.sid] || '', l.date, l.time || '', STAT[l.status] || STAT.done, l.topic || '', l.note || '',
      Number(l.fee) || 0, l.paid ? 'Evet' : 'Hayır', l.paid ? (l.paidAt || '') : '', l.postponedFrom || ''];
  });
  fill_(ss.getSheetByName(SHEETS.students), srows, HEAD_S.length);
  fill_(ss.getSheetByName(SHEETS.lessons), lrows, HEAD_L.length);
  if (s.theme) ss.getSheetByName(SHEETS.meta).getRange(2, 2).setValue(s.theme);
}

function data_(sh, n) {
  var last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, n).getValues();
}
function pad_(n) { return (n < 10 ? '0' : '') + n; }
function dstr_(v, tz) {
  if (v instanceof Date) return Utilities.formatDate(v, tz, 'yyyy-MM-dd');
  return String(v == null ? '' : v).trim();
}
function tstr_(v, tz) {
  if (v instanceof Date) return Utilities.formatDate(v, tz, 'HH:mm');
  return String(v == null ? '' : v).trim();
}
function newId_(sh, row) {
  var id = Utilities.getUuid().slice(0, 7);
  sh.getRange(row, 1).setValue(id);
  return id;
}

function read_(ss) {
  var tz = ss.getSpreadsheetTimeZone();
  var ssh = ss.getSheetByName(SHEETS.students), lsh = ss.getSheetByName(SHEETS.lessons);
  var students = [], byName = {};
  data_(ssh, HEAD_S.length).forEach(function (r, i) {
    if (!r[0] && !r[1]) return;
    var id = String(r[0] || newId_(ssh, i + 2));
    var day = DAYS.indexOf(String(r[3]).trim());
    var rep = 1;
    if (String(r[6]).trim() === REP['2']) rep = 2;
    if (String(r[6]).trim() === REP['0']) rep = 0;
    students.push({id: id, name: String(r[1]), cat: String(r[2] || 'Özel ders'), day: day, time: tstr_(r[4], tz),
      fee: Number(r[5]) || 0, interval: rep, active: String(r[7]).trim() !== 'Hayır'});
    byName[String(r[1])] = id;
  });
  var lessons = [];
  data_(lsh, HEAD_L.length).forEach(function (r, i) {
    if (!r[0] && !r[3] && !r[1] && !r[2]) return;
    var id = String(r[0] || newId_(lsh, i + 2));
    var sid = String(r[1] || byName[String(r[2])] || '');
    var status = 'done', t = String(r[5]).trim();
    if (t === STAT.planned) status = 'planned';
    if (t === STAT.missed || t === 'Yapılmadı') status = 'missed';
    var paid = String(r[9]).trim() === 'Evet';
    lessons.push({id: id, sid: sid, date: dstr_(r[3], tz), time: tstr_(r[4], tz), status: status, topic: String(r[6] || ''),
      note: String(r[7] || ''), fee: Number(r[8]) || 0, paid: paid, paidAt: paid ? dstr_(r[10], tz) : '', postponedFrom: dstr_(r[11], tz)});
  });
  var meta = ss.getSheetByName(SHEETS.meta);
  var theme = String(meta.getRange(2, 2).getValue() || 'tablo');
  return {students: students, lessons: lessons, theme: theme};
}
