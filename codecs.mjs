// -*- coding: utf-8, tab-width: 2 -*-

import quotedPrintable from 'quoted-printable';
import mustBe from 'typechecks-pmb/must-be';
import vTry from 'vtry';


const EX = {};

function unB64(x) { return Buffer.from(x, 'base64'); }
function unQP(x) { return quotedPrintable.decode(x); }
function latin1to(to, x) { return Buffer.from(x, 'latin1').toString(to); }

EX.dfDeco = {
  '8bit': String,
  base64: unB64,
  'quoted-printable': unQP,
};



EX.dfCharset = {
  'utf-8': latin1to.bind(null, 'UTF-8'),
};


function tryDecodeCore(body, enc, decoders) {
  return mustBe.tProp('decoder ', decoders, 'fun', enc)(body, enc);
}


Object.assign(EX, {

  tryDecode(body, descr, lcEnc, decoders) {
    if (!lcEnc) { return body; }
    return vTry(tryDecodeCore, descr + lcEnc)(body, lcEnc, decoders);
  },

});


export default EX;
