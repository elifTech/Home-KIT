var CryptoJS = require("crypto-js");

var ivArray = [' pe58Jo6ijK3pOSgc4YzlEU ', ' jmWYH1nICds1BrQ4sNmpcB ', ' DcDisDsyyVn03OTWVZlMCL ', ' r1p3D4JP1qEV0JKXDfQMWe ', ' e1rzePCrNL6yNwiUcVP8Zs ', ' wq3JLBJDV8rVfJsrtbr7AD ', ' aMmrRBO44aFobcK8nlcEg0 ', ' pwhM0Nlka7lmmWhCVMDgHD ', ' hq9nqQA7DZXyGuaJQ77S8T ', ' UvPaJNTM3SnIlUgTal5X1E ', ' pZ5sgek8syBrOouCCzqlOy ', ' CebZhwJsVcbnFwnoCSdDy3 ', ' fvYRvC24kob8atYjD1tO0M ', ' M0sQDZfFzqK223vLhBB2FN ', ' 2WjziG76UemT62jm9CprcG ', ' cFAQ4TiOTysByJA6XngoEu ', ' wO9IdzP3u8NYcEcvrzaV8p ', ' HDFbieikSdGtTHxwwyvM2D ', ' D4vaSKDCjAmH9gSm0NIOEk ', ' imrjwVrQPi3212NTiEjpr9 ', ' 6Pl3J6pTpH17m5fBxsZxCI ', ' OAhSBs1I0ScTwv09KEr0k9 ', ' lzdLLLcV2JLEgo65hSlSbw ', ' X4MRzMnXCQaYIJ4TJuIBz6 ', ' QMNv5A4kWA6FQS8vIQngr4 ', ' tso0kAKXaViBeJtj3JJ0zE ', ' BRqUNBgKZpZDzPrVRYZQ1D ', ' rcvmXw2gm9xiKFRWICDKzv ', ' ykrFCmJfO3oIh3KvuSuRJH ', ' 6veWfoRIHG5eTdntbQiDzl ', ' itFtz77bIpsjyvOQgdHwpr ', ' uekNbEZuDKTAUZO1FD3Zfh ', ' mKy3U71LhvSzrNRIh2yad0 ', ' T9otbhzyqiSQAmqe9qLzP4 ', ' uxRZOXHTc7E8TIarkKUPKM ', ' bNplbe1vz4v1CAJ6LfZKAG ', ' ahVwjTBUvHR9dDu7O2kVIi ', ' LYqT4XXGJnJinrVuFwS4XJ ', ' HTimkDlKLuYGQeGWeafER8 ', ' G5ayQunMmtklQCGcCvSEwN ', ' KYY2GdheWcn0DJcvYxcDnk ', ' 3VHbxWUk2qsqhAA28USQPg ', ' gZSoaBs8k6CvHKS50mjsZG ', ' l7TplSo0iuWWtinQ21J5dh ', ' luTfob2j6knJTgv5yDjJQn ', ' FdJM2YlxNc2Wu5ZdBPj0s3 ', ' b32A9z9K98LRosBgq54EdV ', ' pAfJ7iiN0gn6gCvTWAj0c1 ', ' PhMIatOvefQRTzAhnIghVj ', ' p0tZPesJIwVrDUYnpa0uY1 ', ' ymILHOvmETowamIVanjRfG ', ' NQMyJ7StJmq23xuNcCrhFw ', ' AgZXoC4O3YqWkWqinLnFDe ', ' bmQXUlQwCbf49n1QTPmJAJ ', ' c7en56vjahnHPr0kZGR2pc ', ' 0mE8Cb11bjKoSnhF8l2Ckt ', ' F7m8d2EVVWmPta2hJNLmQH ', ' 6Z5DRNoUQNcYb9m9Js6idp ', ' D5FCWkJJPxB8U1EXLscKs1 ', ' zyB2NHDgwllU52LfRW1COZ ', ' t0GbC0QO29YUdSrSMxu2pV ', ' XRTyV1d2mfZF681rsbdIx0 ', ' Scw2nuknuc2wUTO7sthuIZ ', ' xPISO300fPnq5STZP3CylX ', ' kwyOwacxKlhtXuI3CNWUn3 ', ' H7l8bSZFZmw2NF8zYkBZBb ', ' IdTVxPSA9iIl5w1ZxUXlKx ', ' B3IVY9RoBYeZbcd8zOaPVz ', ' hBUE3aXoN6yLpxviHClaEl ', ' 3A34aTq6R8cKGUM46vXOZ2 ', ' yhz1mr8X7O4Q7tUkEUukIM ', ' UTyGivjQ0G7ra0Y7ZdUAug ', ' 50TFhEGFiOYTzL1Fy7y9Ae ', ' ecld7cVvtpGV2lcxqgAaop ', ' aWbUVhMtzuilvyE6ngUS6F ', ' 6NrxXmWJMCp2W9nL1XDv0l ', ' v8vh57fjdWr8N0oYtDs8pj ', ' 7lJke0mEXFSzMdEMiQP7hS ', ' nfbHCHhDUmgb2NeMqrAfba ', ' ojo6Zp0Eo4tB1L57GPHK5L ', ' VJnUUVUnmJYW6oPFFxqRkD ', ' VtK7cXRR9Ps31CV8ek90hP ', ' CkiXI80xyHcQRbLHy1V7lB ', ' k3syIFQOf1k2rmY4MldTLa ', ' dYpUIrHpmBr6WyUdftSdX0 ', ' dgeux7buJfjiUwu7c8ClAt ', ' FvkhwZTJfpNLl5KPqxWa4w ', ' mooXO3mhrIPs9Z5H9AYwzc ', ' Xuxved5GbRxWFvY3IaUL8f ', ' BJbrjXHVrnMzWQl3D9ERhp ', ' A2BYrlHYOuwYLRIuDj2KHb ', ' SWx3X7tHsxVkPdEDy6XBcS ', ' HkRliMnE39sdyem6QD4BIf ', ' hrAeWiLjDRtRAATtm4p9Pw ', ' 9rprMlAXiLsPSygVv8FmqZ ', ' 7xAzAouaY68yam2H5NIqd3 ', ' 3BDhAQRTj67koqlrjW9Wc1 ', ' AYBahWAaR9jeupJvGbA4bO ', ' FNmmhKs8UqYi0r78OXG4lJ ', ' PhhHdu8hbN3uBrcnZZnVbu '];

var AESKey = '2B7E151628AED2A6ABF7158809CF4F3C';
var key = CryptoJS.enc.Hex.parse(AESKey);

exports.decode = function(msg, arrayIndex) {
    var currentIv = ivArray[arrayIndex];
    var plain_iv = new Buffer(currentIv, 'base64').toString('hex');
    var iv = CryptoJS.enc.Hex.parse(plain_iv);

    var bytes = CryptoJS.AES.decrypt(msg, key, {
        iv: iv
    });
    var plaintext = bytes.toString(CryptoJS.enc.Base64);
    var decoded_b64msg = new Buffer(plaintext, 'base64').toString('ascii');
    var decoded_msg = new Buffer(decoded_b64msg, 'base64').toString('ascii');
    return decoded_msg;
}

exports.encode = function(rawMsg, arrayIndex) {
    var currentIv = ivArray[arrayIndex];
    var plain_iv = new Buffer(currentIv, 'base64').toString('hex');
    var iv = CryptoJS.enc.Hex.parse(plain_iv);

    var wordArray = CryptoJS.enc.Utf8.parse(rawMsg);
    var base64 = CryptoJS.enc.Base64.stringify(wordArray)
    var encrypted = CryptoJS.AES.encrypt(base64, key, {
        iv: iv
    });
    return encrypted.toString();
}
exports.getRandomArrayIv = function() {
    var rand = Math.floor(Math.random() * ivArray.length);
    return rand;
}
