// -*- coding: utf-8, tab-width: 2 -*-

import splitOnce from 'split-string-or-buffer-once-pmb';
import libMime from 'libmime';
import getOwn from 'getown';
import mustBe from 'typechecks-pmb/must-be';

import codecs from './codecs';


const EX = {

  normText(raw) { return raw.toString('latin1').replace(/\r/g, ''); },

  splitParseHeaders(raw) {
    let tmp = EX.normText(raw);
    tmp = (splitOnce('\n\n', tmp) || [tmp]);
    const body = (tmp[1] || '');
    tmp = (tmp[0] || '').replace(/\n\s+/g, ' ');
    const head = libMime.decodeHeaders(tmp);
    const firstHeader = EX.firstHeader.bind(null, head);
    tmp = libMime.parseHeaderValue(EX.firstHeader(head, 'content-type', ''));
    const cType = mustBe.nest('MIME type', tmp.value);
    tmp = (tmp.params || false);
    if (tmp && (Object.keys(tmp).length < 1)) { tmp = false; }
    const ctDetails = tmp;
    return {
      head,
      firstHeader,
      cType,
      ctDetails,
      body,
    };
  },

  firstHeader(headers, key, dflt, rgx) {
    let val = getOwn(getOwn(headers, key), 0, dflt);
    if (rgx) { val = (rgx.exec(val) || false); }
    return val;
  },

  defaultBodyContentDecoders() { return codecs.dfDeco; },
  defaultBodyCharsetDecoders() { return codecs.dfCharset; },

  parseAttachment(raw, opt) {
    const safeOpt = (opt || false);
    const att = EX.splitParseHeaders(raw);
    let { body } = att;
    delete att.body;

    const enc = EX.firstHeader(att.head, 'content-transfer-encoding',
      '').toLowerCase();
    body = codecs.tryDecode(body, 'Decode attachment body using ', enc,
      (safeOpt.bodyContentDecoders || codecs.dfDeco));
    const chs = (att.ctDetails.charset || '').toLowerCase();
    body = codecs.tryDecode(body, 'Decode attachment body charset ', chs,
      (safeOpt.bodyCharsetDecoders || codecs.dfCharset));

    return {
      fileName: att.ctDetails.name,
      cType: att.cType,
      origBodyEncoding: enc,
      origBodyCharset: chs,
      body,
      ...att,
    };
  },

};


export default EX;
