import { Login, Profile } from '../src/types';
declare class NaverAuth {
    private accessToken;
    login(clientId: string, callbackUrl: string): Promise<Login>;
    handleTokenResponse(): void;
    getProfile(accessToken?: string): Promise<Profile>;
}
declare const _default: NaverAuth;
export default _default;
