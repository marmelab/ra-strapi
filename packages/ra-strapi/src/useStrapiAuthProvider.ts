import { AuthProvider, Options, fetchUtils } from "react-admin";
import { STRAPI_JWT_KEY, strapiAuthProvider } from "./strapiAuthProvider";

export type StrapiAuthProviderParams = {
  baseURL: string;
  authType?: "jwt" | "apiKey";
};

export const useStrapiAuthProvider = ({
  baseURL,
  authType = "jwt",
}: StrapiAuthProviderParams): {
  strapiAuthProvider: AuthProvider;
  httpClient: any;
} => {
  const getAuthorizationToken = () => {
    if (!authType) return {};
    const token =
      authType === "jwt"
        ? localStorage.getItem(STRAPI_JWT_KEY)
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
  return {
    strapiAuthProvider: strapiAuthProvider({ baseURL }),
    httpClient,
  };
};
