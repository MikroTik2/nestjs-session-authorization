import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validate } from "@/common/env";
import { PrismaModule } from "@/libs/prisma";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate,
        }),

        PrismaModule,
    ],
})
export class AppModule {}
