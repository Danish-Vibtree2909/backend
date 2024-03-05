interface GoogleTokensResult {
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
}
export declare function getGoogleOAuthTokens({ code, }: {
    code: string;
}): Promise<GoogleTokensResult>;
interface GoogleUserResult {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}
export declare function getGoogleUser({ id_token, access_token, }: {
    id_token: string;
    access_token: string;
}): Promise<GoogleUserResult>;
export {};
//# sourceMappingURL=GoogleOAuthService.d.ts.map