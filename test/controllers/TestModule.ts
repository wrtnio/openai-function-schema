import { Module } from "@nestjs/common";

import { BbsArticlesController } from "./BbsArticlesController";
import { MultipartController } from "./MultipartController";
import { QueryController } from "./QueryController";

@Module({
  controllers: [BbsArticlesController, MultipartController, QueryController],
})
export class TestModule {}
