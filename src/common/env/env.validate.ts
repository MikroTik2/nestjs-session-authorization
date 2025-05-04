import { plainToInstance } from "class-transformer";
import { IsNumber, IsNotEmpty, IsString, validateSync, Min, Max } from "class-validator";

class EnvironmentVariables {
    @IsString()
    @IsNotEmpty()
    NODE_ENV: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(65535)
    APPLICATION_PORT: number;

    @IsString()
    @IsNotEmpty()
    APPLICATION_URL: string;

    @IsString()
    @IsNotEmpty()
    ALLOWED_ORIGIN: string;

    @IsString()
    @IsNotEmpty()
    COOKIES_SECRET: string;

    @IsString()
    @IsNotEmpty()
    SESSION_SECRET: string;

    @IsString()
    @IsNotEmpty()
    SESSION_NAME: string;

    @IsString()
    @IsNotEmpty()
    SESSION_DOMAIN: string;

    @IsString()
    @IsNotEmpty()
    SESSION_MAX_AGE: string;

    @IsString()
    @IsNotEmpty()
    SESSION_HTTP_ONLY: string;

    @IsString()
    @IsNotEmpty()
    SESSION_SECURE: string;

    @IsString()
    @IsNotEmpty()
    SESSION_FOLDER: string;

    @IsString()
    @IsNotEmpty()
    POSTGRES_USER: string;

    @IsString()
    @IsNotEmpty()
    POSTGRES_PASSWORD: string;

    @IsString()
    @IsNotEmpty()
    POSTGRES_HOST: string;

    @IsNumber()
    @IsNotEmpty()
    POSTGRES_PORT: number;

    @IsString()
    @IsNotEmpty()
    POSTGRES_DB: string;

    @IsString()
    @IsNotEmpty()
    POSTGRES_URI: string;

    @IsString()
    @IsNotEmpty()
    MAIL_USER: string;

    @IsString()
    @IsNotEmpty()
    MAIL_PASS: string;

    @IsString()
    @IsNotEmpty()
    MAIL_SERVICE: string;

    @IsString()
    @IsNotEmpty()
    MAIL_HOST: string;

    @IsNumber()
    @IsNotEmpty()
    MAIL_PORT: number;

    @IsString()
    @IsNotEmpty()
    REDIS_USER: string;

    @IsString()
    @IsNotEmpty()
    REDIS_PASSWORD: string;

    @IsString()
    @IsNotEmpty()
    REDIS_HOST: string;

    @IsNumber()
    @IsNotEmpty()
    REDIS_PORT: number;

    @IsString()
    @IsNotEmpty()
    REDIS_URI: string;

    @IsString()
    @IsNotEmpty()
    GOOGLE_CLIENT_ID: string;

    @IsString()
    @IsNotEmpty()
    GOOGLE_CLIENT_SECRET: string;

    @IsString()
    @IsNotEmpty()
    GITHUB_CLIENT_ID: string;

    @IsString()
    @IsNotEmpty()
    GITHUB_CLIENT_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
