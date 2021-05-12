/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose'
export interface UrlDetails {
  url: string;
  urlHash: string;
  shortUrl: string;
}

export interface ModelUrlDetails extends UrlDetails, mongoose.Document {}
