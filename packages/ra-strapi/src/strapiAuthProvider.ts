import { AuthProvider, fetchUtils } from "react-admin";

const STRAPI_USER_KEY = "strapi_user";
export const STRAPI_JWT_KEY = "strapi_jwt";

export type StrapiAuthProviderParams = {
  baseURL: string;
  storage: Storage;
};
/**
 * Returns an authProvider that can be used with react-admin and Strapi.
 *
 * @param baseURL **Required** - The base URL of the Strapi API.
 *
 * @example
 * ```ts
 * const authProvider = strapiAuthProvider({ baseURL: "http://localhost:1337" });
 * ```
 */
export const strapiAuthProvider = ({
  baseURL,
  storage = localStorage
}: StrapiAuthProviderParams): AuthProvider => {
  return {
    login: async (params: { email: string; password: string }) => {
      const { email, password } = params;
      const { jwt, user } = await fetchUtils
        .fetchJson(`${baseURL}/api/auth/local`, {
          method: "POST",
          body: JSON.stringify({ identifier: email, password }),
        })
        .then((res) => res.json);
      storage.setItem(STRAPI_USER_KEY, JSON.stringify(user));
      storage.setItem(STRAPI_JWT_KEY, jwt);
    },
    logout: async () => {
      storage.removeItem(STRAPI_USER_KEY);
      storage.removeItem(STRAPI_JWT_KEY);
      return;
    },
    checkError: async (error) => {
      if (error.status === 401) {
        storage.removeItem(STRAPI_USER_KEY);
        storage.removeItem(STRAPI_JWT_KEY);
        return Promise.reject();
      }
      return Promise.resolve();
    },
    checkAuth: async () => {
      if (
        storage.getItem(STRAPI_USER_KEY) &&
        storage.getItem(STRAPI_JWT_KEY)
      ) {
        return Promise.resolve();
      }
      storage.removeItem(STRAPI_USER_KEY);
      storage.removeItem(STRAPI_JWT_KEY);

      return Promise.reject();
    },
    getIdentity: async () => {
      try {
        const user = storage.getItem(STRAPI_USER_KEY);
        if (!user) {
          storage.removeItem(STRAPI_USER_KEY);
          storage.removeItem(STRAPI_JWT_KEY);
          return Promise.reject();
        }
        const parsedUser = JSON.parse(user);
        return { id: parsedUser.id, fullName: parsedUser.username };
      } catch (error) {
        storage.removeItem(STRAPI_USER_KEY);
        storage.removeItem(STRAPI_JWT_KEY);
        return Promise.reject();
      }
    },
  };
};
