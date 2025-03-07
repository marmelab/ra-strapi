import { Options, fetchUtils } from "react-admin";
import { STRAPI_JWT_KEY } from "./strapiAuthProvider";

export type StrapiHttpClientParams = {
  authType?: "jwt" | "apiKey";
  storage?: Storage;
};
/**
 * Returns an httpClient that adds the Authorization header to the requests.
 *
 * @param authType - The type of authentication to use. It can be "jwt" or "apiKey". Default is "jwt".
 * @param storage - The storage to use to store the token. Default is localStorage.
 *
 * @example
 * ```ts
 * const httpClient = strapiHttpClient(); // If you want to use JWT authentication
 * ```
 * or
 * ```ts
 * const httpClient = strapiHttpClient({ authType : "apiKey" }); // If you want to use API Key authentication, it will use the STRAPI_API_KEY environment variable
 * ```
 */
export const strapiHttpClient = ({
  authType = "jwt",
  storage = localStorage,
}: StrapiHttpClientParams): any => {
  const getAuthorizationToken = () => {
    if (!authType) return {};
    if (authType === "apiKey" && !process.env.STRAPI_API_KEY) {
      throw new Error(
        "To use the apiKey authentication, you need to set the STRAPI_API_KEY environment variable"
      );
    }

    const token =
      authType === "jwt"
        ? storage.getItem(STRAPI_JWT_KEY)
        : process.env.STRAPI_API_KEY;
    return {
      authenticated: !!token,
      token: `Bearer ${token}`,
    };
  };
  const httpClient = async (url: string, options: Options = {}) => {
    const user = getAuthorizationToken();
    return fetchUtils.fetchJson(url, {
      ...options,
      user,
    });
  };
  return httpClient;
};
