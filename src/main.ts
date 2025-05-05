import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory, NestApplication } from "@nestjs/core";
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "@/app.module";
import { config } from "dotenv";
import { ConfigService } from "@nestjs/config";
import { ms, parseBoolean, StringValue } from "@/common/utils";
import { RedisStore } from "connect-redis";
import IORedis from "ioredis";

import * as cookieParser from "cookie-parser";
import * as session from "express-session";
config();

async function bootstrap() {
    const app: NestApplication = await NestFactory.create(AppModule);
    const logger = new Logger("NestApplication");

    const config = app.get(ConfigService);
    const redis = new IORedis(config.get<string>("REDIS_URI"));

    app.use(
        session({
            secret: config.get<string>("SESSION_SECRET"),
            name: config.get<string>("SESSION_NAME"),
            resave: true,
            saveUninitialized: false,
            cookie: {
                domain: config.get<string>("SESSION_DOMAIN"),
                maxAge: ms(config.get<StringValue>("SESSION_MAX_aGE")),
                httpOnly: parseBoolean(config.get<string>("SESSION_HTTP_ONLY")),
                secure: parseBoolean(config.get<string>("SESSION_SECURE")),
                sameSite: "lax",
            },
            store: new RedisStore({
                client: redis,
                prefix: config.get<string>("SESSION_FOLDER"),
            }),
        }),
    );

    app.use(cookieParser(config.get("COOKIES_SECRET")));

    app.enableCors({
        origin: config.get<string>("ALLOWED_ORIGIN"),
        credentials: true,
        exposeHeaders: ["set-cookie"],
    });
    app.setGlobalPrefix("api/v1");

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );

    setupOpenAPI(app);

    await app.listen(config.get<number>("APPLICATION_PORT"));

    logger.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();

function setupOpenAPI(app: NestApplication) {
    const config = new DocumentBuilder()
        .setTitle("NestJS Session Authorization")
        .setDescription("Simple and secure session-based authentication system built with NestJS. Manage user login, sessions, and protected routes with ease.")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config, {
        extraModels: [],
    });

    const options: SwaggerCustomOptions = {
        swaggerOptions: {
            filter: true,
            showRequestDuration: true,
        },
    };

    SwaggerModule.setup("docs", app, document, options);
}
