
<!--#echo json="package.json" key="name" underline="=" -->
parse-mail-attachment-pmb
=========================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Parse a single email attachment into meta data and body.
<!--/#echo -->



API
---

This module exports an object that holds these functions:

### splitParseHeaders(raw)

`raw` should be a Buffer or "binary" (latin-1) String.

Returns a dictionary with these entries:

* `head`: The headers dictionary, as parsed by `libmime`.
  The keys are converted to lowercase,
  and the values are arrays, because some headers may occur multiple times.
* `firstHeader`: A bound version of the same-named function from this module.
* `cType`: The MIME type, without parameters.
* `ctDetails`: A dictionary object of the content type parameters,
  if there were any. Otherwise, `false`.
* `body`: The body, as a string. Raw except line terminators are normalized.



### firstHeader(headers, key, dflt, rgx)

`headers` should be a dictionary mapping header names to arrays of strings.

First, it determines the header value:
If the header exists in `headers`, the first entry of its array is used.
If the headers does not exist or its array doesn't have a first entry,
uses `dflt`.
If `rgx` is false-y, the header value is returned.

`rgx` may also be a RegExp. In this case, it's `.exec` method is invoked
with the header value as its only arument. If the result from exec is
truthy, it is returned; otherwise, returns `false`.



### parseAttachment(raw, opt)

`raw` should be a Buffer or "binary" (latin-1) String.

`opt` is an optional options object that supports these keys:

* `bodyContentDecoders`: A dictionary mapping encoding names to decoders.
  If false-y, the dictionary of built-in decoders is used,
  see `defaultBodyContentDecoders()`.

Returns a dictionary with these entries:

* All the ones from `splitParseHeaders()`.
* `fileName`: (string) Original filename if one was found.
* `origBodyEncoding`: (string) The body encoding name.
* `body`: The decoded body.



### defaultBodyContentDecoders()

Returns a dictionary mapping encoding names to built-in known decoders.









Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
