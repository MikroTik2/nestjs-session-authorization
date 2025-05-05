import { ConfigService } from "@nestjs/config";
import { TypeOptions } from "../constants";
import { GoogleProvider } from "../providers";

export const getOAuthConfig = async (configService: ConfigService): Promise<TypeOptions> => ({
    baseUrl: configService.get<string>("APPLICATION_URL"),
    services: [
        new GoogleProvider({
            client_id: configService.get<string>("GOOGLE_CLIENT_ID"),
            client_secret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
            scopes: ["email", "profile"],
        }),
    ],
});
