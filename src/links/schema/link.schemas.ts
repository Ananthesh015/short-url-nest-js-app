/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose'

export const ShortUrlSchema = new mongoose.Schema({
  url: String,
  urlHash: String,
  shortUrl: String,
});
