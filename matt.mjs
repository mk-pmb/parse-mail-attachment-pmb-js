// -*- coding: utf-8, tab-width: 2 -*-

import splitOnce from 'split-string-or-buffer-once-pmb';
import mustBe from 'typechecks-pmb/must-be';
import libMime from 'libmime';
import getOwn from 'getown';
import vTry from 'vtry';


const dfDeco = {
  '': String,
  base64(rawBody) { return Buffer.from(rawBody, 'base64'); },
};


const EX = {

  splitParseHeaders(raw) {
    let tmp = splitOnce('\n\n', raw.toString('latin1').replace(/\r/g));
    const body = (tmp[1] || '');
    tmp = tmp[0].replace(/\n\s+/g, ' ');
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

  defaultBodyContentDecoders() { return dfDeco; },

  parseAttachment(raw, opt) {
    const info = EX.splitParseHeaders(raw);
    const enc = EX.firstHeader(info.head, 'content-transfer-encoding', '');
    const deco = mustBe.tProp('Attachmend body decoders',
      ((opt || false).bodyContentDecoders || dfDeco), 'fun', enc);
    const body = vTry(deco, 'Decode attachment body using ' + enc)(info.body);
    delete info.body;
    return {
      fileName: info.ctDetails.name,
      cType: info.cType,
      origBodyEncoding: enc,
      body,
      ...info,
    };
  },

};


export default EX;
