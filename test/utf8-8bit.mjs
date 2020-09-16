// -*- coding: utf-8, tab-width: 2 -*-

import test from 'p-tape';

import matt from '..';

test('Decodes 8bit UTF-8 correctly', async(t) => {
  t.plan(6);
  const sunMark = ' sun ';
  const sunChar = '🌞';
  const endMark = ' ';
  const sunText = sunMark + sunChar + endMark;
  const textLines = [
    'hello.',
    '¦Üµłäuttëß™Ø' + sunText + '×…·÷º°¹²³¿¡',
    'bye.',
    '',
  ];
  const raw = Buffer.from([
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    ...textLines,
  ].join('\r\n'), 'UTF-8');

  const sunStart = raw.indexOf(sunMark);
  const sunBytes = String.fromCharCode(0xF0, 0x9F, 0x8C, 0x9E);
  const sunBuf = raw.slice(sunStart,
    sunStart + sunMark.length + sunBytes.length + endMark.length);
  t.same(sunBuf.toString('utf8'), sunText);
  t.same(sunBuf.toString('latin1'), sunMark + sunBytes + endMark);

  const mail = matt.parseAttachment(raw);

  t.same(mail.cType, 'text/plain');
  t.same(mail.origBodyEncoding, '8bit');
  t.same(mail.origBodyCharset, 'utf-8');
  t.same(mail.body, textLines.join('\n'));
  t.end();
});
