import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { ShortUrlSchema } from './schema/link.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ShortUrl', schema: ShortUrlSchema }]),
  ],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
