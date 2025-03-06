import { AuthProvider, fetchUtils } from "react-admin";

const STRAPI_USER_KEY = "strapi_user";
export const STRAPI_JWT_KEY = "strapi_jwt";

export type StrapiAuthProviderParams = {
  baseURL: string;
};

export const strapiAuthProvider = ({
  baseURL,
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
      localStorage.setItem(STRAPI_USER_KEY, JSON.stringify(user));
      localStorage.setItem(STRAPI_JWT_KEY, jwt);
    },
    logout: async () => {
      localStorage.removeItem(STRAPI_USER_KEY);
      localStorage.removeItem(STRAPI_JWT_KEY);
      return;
    },
    checkError: async (error) => {
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem(STRAPI_USER_KEY);
        localStorage.removeItem(STRAPI_JWT_KEY);
        return Promise.reject();
      }
      return Promise.resolve();
    },
    checkAuth: async () => {
      if (
        localStorage.getItem(STRAPI_USER_KEY) &&
        localStorage.getItem(STRAPI_JWT_KEY)
      ) {
        return Promise.resolve();
      }
      localStorage.removeItem(STRAPI_USER_KEY);
      localStorage.removeItem(STRAPI_JWT_KEY);

      return Promise.reject();
    },
    getIdentity: async () => {
      try {
        const user = localStorage.getItem(STRAPI_USER_KEY);
        if (!user) {
          localStorage.removeItem(STRAPI_USER_KEY);
          localStorage.removeItem(STRAPI_JWT_KEY);
          return Promise.reject();
        }
        const parsedUser = JSON.parse(user);
        return { id: parsedUser.id, fullName: parsedUser.username };
      } catch (error) {
        localStorage.removeItem(STRAPI_USER_KEY);
        localStorage.removeItem(STRAPI_JWT_KEY);
        return Promise.reject();
      }
    },
  };
};
