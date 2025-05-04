import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validate } from "@/common/env";
import { PrismaModule } from "@/libs/prisma";
import { SecurityModule } from "@/libs/security";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate,
        }),

        PrismaModule,
        SecurityModule,
    ],
})
export class AppModule {}
