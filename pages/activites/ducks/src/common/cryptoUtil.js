// "use strict";
// const CryptoJS = require("crypto-js");
import CryptoJS from 'crypto-es'

import { testBuryingpoint, getUrlParam } from "@skr/act-utils/lib/tool";
// 加密
export function encrypt(plaintext, key) {
  return CryptoJS.AES.encrypt(plaintext, key, {
    iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
}

// 解密
export function decrypt(decodedString, key) {
  return new Promise((resolve) => {
    try {
      const decodedStrings = decodedString.replace(/\s/g, "");
      const keys = CryptoJS.enc.Utf8.parse(key);
      const decodedStringt = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Base64.parse(decodedStrings)
      );
      const target = CryptoJS.AES.decrypt(decodedStringt, keys, {
        iv: keys,
      }).toString(CryptoJS.enc.Utf8);
      resolve(target);
    } catch (error) {
      resolve(false);
    }
  });
}

export async function encryptData(message, key, callback) {
  try {
    const res = await decrypt(message, key);
    if (!res) {
      callback && callback(false);
      try {
        testBuryingpoint("ducks_decrypting_logs", 1, {
          subjectID: `${getUrlParam("userID")}-2a`,
        });
      } catch (error) {
        // console.log(error, error);
      }
      return;
    }
    const temp = JSON.parse(res);
    callback && callback(temp);
  } catch (error) {
    try {
      testBuryingpoint("ducks_decrypting_logs", 1, {
        subjectID: `${getUrlParam("userID")}-2a`,
      });
    } catch (error) {
      // console.log(error, error);
    }
    callback && callback(false);
  }
}
