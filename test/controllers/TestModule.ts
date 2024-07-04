import { Module } from "@nestjs/common";

import { BbsArticlesController } from "./BbsArticlesController";
import { MembershipController } from "./MembershipController";
import { MultipartController } from "./MultipartController";
import { QueryController } from "./QueryController";

@Module({
  controllers: [
    BbsArticlesController,
    MembershipController,
    MultipartController,
    QueryController,
  ],
})
export class TestModule {}
