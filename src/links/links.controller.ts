import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
// eslint-disable-next-line prettier/prettier
import { Request , Response} from 'express';
import { LinksService } from './links.service';
import { UrlDto } from './links.dto';
import { UrlDetails } from './link.model';

let urlDetails: UrlDetails;

@Controller('links')
export class LinksController {
  constructor(private readonly linkService: LinksService) {}

  // @HttpCode(302)
  // @Get(':urlHash')
  // @Header('Location', 'www.google.com')
  // find(
  //   @Param('urlHash') urlHash: string,
  //   // @Req() req: Request,
  //   // @Response() res: Res,
  // ) {
  //   // const urlDetails = this.linkService.getUrlDetails(urlHash);
  //   // return urlDetails;
  //   // return res.set('Location', 'www.google.com').json(urlDetails);
  // }

  // forrediect use nest @httpcode,header but is it static
  // to make it dinamic using the express res properties

  @Get()
  findAll(): Promise<UrlDetails[]> {
    return this.linkService.findAll();
  }

  @Get(':urlHash')
  async urlDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Param('urlHash') urlHash: string,
  ) {
    urlDetails = await this.linkService.getUrlDetails(urlHash);
    res.redirect(302, urlDetails.url);
    return '';
  }

  @Post()
  @HttpCode(200)
  @Header('Content-type', 'application/json')
  async shortendUrl(@Body() urlDto: UrlDto): Promise<UrlDetails> {
    if (!!urlDto.url) {
      const { url, urlHash, shortUrl } =
        await this.linkService.createUrlDetails(urlDto.url);
      return { url, urlHash, shortUrl };
    } else {
      throw new NotFoundException('Url not found');
    }
  }

  @Put(':urlHash')
  update(
    @Param('urlHash') urlHash: string,
    @Body('url') url: string,
  ): Promise<UrlDetails> {
    if (!!url) {
      return this.linkService.UpdateUrl(urlHash, url);
    } else {
      throw new NotFoundException('Url not found');
    }
  }
  @Patch()
  updateShortUrl(@Body('url') url: string): Promise<UrlDetails> {
    if (!!url) {
      return this.linkService.Update(url);
    } else {
      throw new NotFoundException('Url not found');
    }
  }
  @Delete(':urlHash')
  delete(@Param('urlHash') urlHash: string): Promise<UrlDetails> {
    return this.linkService.deletebyUrlHash(urlHash);
  }
}
