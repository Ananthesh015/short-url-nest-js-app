import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as ShortId from 'short-uuid';
import { ConfigService } from '@nestjs/config';
import { ModelUrlDetails, UrlDetails } from './link.model';

@Injectable()
export class LinksService {
  static getUrlDetails: any;
  constructor(
    @InjectModel('ShortUrl')
    private readonly shortUrlModel: Model<ModelUrlDetails>,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<UrlDetails[]> {
    const urlDetailsDoc: UrlDetails[] = await this.shortUrlModel.find();
    return urlDetailsDoc.map((doc) => ({
      url: doc.url,
      urlHash: doc.urlHash,
      shortUrl: doc.shortUrl,
    }));
  }

  async getUrlDetails(urlHash: string): Promise<UrlDetails> {
    const docs: UrlDetails = await this.shortUrlModel.findOne({
      urlHash: urlHash,
    });
    if (!!docs) {
      return docs;
    } else {
      throw new NotFoundException('Could not find urlHash');
    }
  }

  async createUrlDetails(url: string): Promise<UrlDetails> {
    const Details: UrlDetails = this.createDetails(url);
    const newDetails: ModelUrlDetails = new this.shortUrlModel(Details);
    const { index } = await this.findIndex(url);
    if (index == -1) {
      return await newDetails.save();
    } else {
      throw new Error('Detail already present in DB');
    }
  }

  async UpdateUrl(urlHash: string, url: string): Promise<UrlDetails> {
    const docs = await this.shortUrlModel.find({ urlHash });
    if (docs.length >= 1) {
      return await this.shortUrlModel.findOneAndUpdate(
        { urlHash },
        { $set: { url } },
        { new: true },
      );
    } else {
      throw new NotFoundException('urlHash Detail not present in DB');
    }
  }

  async Update(url: string): Promise<UrlDetails> {
    const shortId: string = ShortId.generate();
    const { index, docs } = await this.findIndex(url);
    if (index != -1) {
      const updatedDoc: UrlDetails = docs[index];
      updatedDoc.urlHash = shortId;
      updatedDoc.shortUrl = this.configService.get('URI') + shortId;
      return updatedDoc;
    } else {
      throw new NotFoundException('url not found in DB');
    }
  }

  async deletebyUrlHash(urlHash: string): Promise<UrlDetails> {
    return await this.shortUrlModel.findOneAndDelete({ urlHash });
  }
  private createDetails(url: string): UrlDetails {
    const shortId: string = ShortId.generate();
    const createDetails: UrlDetails = {
      url,
      urlHash: shortId,
      shortUrl: this.configService.get('URI') + shortId,
    };
    return createDetails;
  }

  private async findIndex(
    key: string,
  ): Promise<{ index: number; docs: UrlDetails[] }> {
    const docs: UrlDetails[] = await this.shortUrlModel.find();
    return { index: docs.findIndex((doc) => doc.url === key), docs };
  }
}
