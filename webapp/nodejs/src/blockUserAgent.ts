import { Handler } from "express";

const BLOCK_UA_REGEXP_LIST = [/ISUCONbot(-Mobile)?/,
  /ISUCONbot-Image\//,
  /Mediapartners-ISUCON/,
  /ISUCONCoffee/,
  /ISUCONFeedSeeker(Beta)?/,
  /crawler \(https:\/\/isucon\.invalid\/(support\/faq\/|help\/jp\/)/,
  /isubot/,
  /Isupider/,
  /Isupider(-image)?\+/,
  /(bot|crawler|spider)(?:[-_ .\/;@()]|$)/i];

export const blockUserAgent: Handler = (req, res, next) => {
  console.log("ua:", req.useragent.source);
  for(const blockingUA of BLOCK_UA_REGEXP_LIST) {
    if(blockingUA.test(req.useragent.source)) {
      return res.status(503).send();
    }
  }
  
  next();
};
