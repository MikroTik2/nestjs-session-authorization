import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";

import { TypeBaseProviderOptions, TypeUserInfo } from "../types";

@Injectable()
export class BaseOAuthService {
    private BASE_URL: string;
    public constructor(private readonly options: TypeBaseProviderOptions) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
        return {
            ...data,
            provider: this.options.name,
        };
    }

    public getAuthUrl() {
        const query = new URLSearchParams({
            response_type: "code",
            client_id: this.options.client_id,
            redirect_uri: this.getRedirectUrl(),
            scope: (this.options.scopes ?? []).join(" "),
            access_type: "offline",
            prompt: "consent",
        });

        return `${this.options.authorize_url}?${query}`;
    }

    public async findUserByCode(code: string): Promise<TypeUserInfo> {
        const client_id = this.options.client_id;
        const client_secret = this.options.client_secret;

        const tokenQuery = new URLSearchParams({
            client_id,
            client_secret,
            code,
            redirect_uri: this.getRedirectUrl(),
            grant_type: "authorization_code",
        });

        const tokensRequest = await fetch(this.options.access_url, {
            method: "POST",
            body: tokenQuery,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
        });

        if (!tokensRequest.ok) {
            throw new BadRequestException(`Failed to get the user with ${this.options.profile_url}. Check if the access token is correct.`);
        }

        const tokens = await tokensRequest.json();

        if (!tokens.access_token) {
            throw new BadRequestException(`No tokens with ${this.options.access_url}. Make sure the authorization code is valid.`);
        }

        const userRequest = await fetch(this.options.profile_url, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });

        if (!userRequest.ok) {
            throw new UnauthorizedException(`Failed to get the user with ${this.options.profile_url}. Check if the access token is correct.`);
        }

        const user = await userRequest.json();

        const userData = await this.extractUserInfo(user);

        return {
            ...userData,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: tokens.expires_at || tokens.expires_in,
            provider: this.options.name,
        };
    }

    private getRedirectUrl() {
        return `${this.BASE_URL}/api/v1/auth/oauth/callback/${this.options.name}`;
    }

    // eslint-disable-next-line no-restricted-syntax
    public set baseUrl(value: string) {
        this.BASE_URL = value;
    }

    public get name() {
        return this.options.name;
    }

    public get access_url() {
        return this.options.access_url;
    }

    public get profile_url() {
        return this.options.profile_url;
    }

    public get scopes() {
        return this.options.scopes;
    }
}
