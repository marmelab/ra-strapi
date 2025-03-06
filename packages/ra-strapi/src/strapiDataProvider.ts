import qs from "qs";
import {
  CreateParams,
  DataProvider,
  Options,
  UpdateParams,
  fetchUtils,
} from "react-admin";
import { STRAPI_JWT_KEY } from "./strapiAuthProvider";
const POPULATE_ALL = "populate=*";
const OPERATORS = {
  _gte: "$gte",
  _lte: "$lte",
  _neq: "$ne",
  _q: "$contains",
};

type StrapiPagination = {
  page: number;
  pageSize: number;
};
type StrapiGetListQuery = {
  pagination?: StrapiPagination;
  sort?: string[];
  filters?: any;
};
type StrapiGetManyReferenceQuery = {
  pagination?: StrapiPagination;
  sort?: string[];
  filters?: any;
};
const useStrapiDataProvider = (baseURL: string) => {
  const addBaseURLRecursively = (data) => {
    if (!data) return;
    if (Array.isArray(data)) {
      return data.map((item) => addBaseURLRecursively(item));
    }
    if (data.hasOwnProperty("url")) {
      const { url, ...rest } = data;
      const updatedRest = Object.entries(rest).reduce((acc, [key, value]) => {
        acc[key] =
          typeof value === "object" ? addBaseURLRecursively(value) : value;
        return acc;
      }, {});
      return {
        ...updatedRest,
        url: url.includes("http") ? url : `${baseURL}${url}`,
      };
    }
    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] =
        typeof value === "object" ? addBaseURLRecursively(value) : value;
      return acc;
    }, {});
  };
  const toRaAttributes = (attributes: any) => {
    Object.keys(attributes).forEach((key: string) => {
      const data = attributes[key];
      if (!data) return;
      if (data.hasOwnProperty("mime")) {
        attributes[key] = addBaseURLRecursively(data);
        return;
      }
      // it's an strapi object
      if (data.hasOwnProperty("documentId")) {
        attributes[key] = data.documentId;
        return;
      }
      // it's an array of strapi objects
      if (Array.isArray(data) && data.length > 0 && data[0]?.documentId) {
        attributes[key] = data.map((item: any) => item.documentId);
        return;
      }
      // else we keep the value as is
    });

    return attributes;
  };

  return {
    toRaRecord: (data: any) => {
      const { documentId, id, blocks, ...attributes } = data;
      return {
        id: documentId,
        ref: id,
        ...toRaAttributes(attributes),
      };
    }
  };
};

const toStrapiFilter = (raFilter: any) => {
  if (!raFilter) return null;
  let filters: any = {};

  Object.keys(raFilter).forEach((key) => {
    if (typeof raFilter[key] === "object") {
      return (filters[key] = toStrapiFilter(raFilter[key]));
    }

    const operator = OPERATORS[key.slice(-4) as keyof typeof OPERATORS];
    if (key.slice(-2) === "_q") {
      const field = key.slice(0, -2);
      filters[field] = {
        $containsi: raFilter[key],
      };
    } else if (key === "id") {
      filters.componentId = {
        $in: raFilter.id,
      };
    } else if (operator) {
      const field = key.slice(0, -4);
      filters[field] = {
        [operator]: raFilter[key],
      };
    } else {
      filters[key] = {
        $eq: raFilter[key],
      };
    }
  });

  return filters;
};

const isMultimedia = (value: any) => {
  return (
    (value && value.hasOwnProperty("rawFile")) ||
    (Array.isArray(value) &&
      value.length > 0 &&
      (value[0].hasOwnProperty("rawFile") || value[0].hasOwnProperty("mime")))
  );
};

const curateData = (data: any) => {
  const {
    id,
    ref,
    createdAt,
    publishedAt,
    updatedAt,
    documentId,
    ...curatedData
  } = data;
  Object.entries(curatedData).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      if (value.hasOwnProperty("mime")) {
        delete curatedData[key];
      }
      curateData[key] = curateData(value);
    }
    if (Array.isArray(value) && value.length > 0) {
      curatedData[key] = value.map((item) => curateData(item));
    }
  });
  return curatedData;
};

const toStrapiBody = (params: UpdateParams | CreateParams) => {
  const { data, multimedia } = Object.entries(curateData(params.data)).reduce(
    (acc, [key, value]) => {
      if (isMultimedia(value)) {
        if (!acc.multimedia) {
          acc.multimedia = {};
        }
        acc.multimedia[key] = value;
        return acc;
      }
      acc.data[key] = value === "" ? null : value;
      return acc;
    },
    { data: {}, multimedia: null }
  );

  if (multimedia) {
    const formData = new FormData();
    Object.entries(multimedia).forEach(([key, value]: [string, any]) => {
      if (Array.isArray(value)) {
        const elementIds = [];
        value.forEach((file) => {
          file.rawFile instanceof File
            ? formData.append(`files.${key}`, file.rawFile, file.title)
            : elementIds.push(file.id);
        });
        data[key] = elementIds;
        return;
      }
      if (value.rawFile instanceof File) {
        formData.append(`files.${key}`, value.rawFile, value.title);
        return;
      }
      if (!(value.rawFile instanceof File) && data.hasOwnProperty(key)) {
        data[key] = [value.id];
      }
    });

    formData.append("data", JSON.stringify(data));
    return formData;
  }
  return JSON.stringify({ data });
};

/**
 * Returns a dataProvider that can be used with react-admin.
 *
 * @param baseURL **Required** - The base URL of the Strapi API.
 * @param authType *Optional* - The type of authentication to use. Values can be "jwt", you can use this with the strapiAuthProvider, or "apiToken" if you want to use a static token (https://docs.strapi.io/user-docs/settings/API-tokens). If not provided, it will use the public api.
 *
 * @example
 * ```ts
 * const authProvider = googleAuthProvider({
 *   gsiParams: {
 *     client_id: "my-application-client-id.apps.googleusercontent.com",
 *     ux_mode: "popup",
 *   },
 *   tokenStore: myTokenStore,
 * });
 * ```
 */
export type StrapiDataProviderConf = {
  baseURL: string;
  httpClient?: any;
};

export const strapiDataProvider = (
  {
    baseURL,
    httpClient = fetchUtils.fetchJson
  }
): Required<DataProvider> => {
  const API_URL = `${baseURL}/api`;

  const { toRaRecord} = useStrapiDataProvider(baseURL);

  return {
    getList: async (resource, { pagination, sort, filter }) => {
      const { page = 1, perPage = 10 } = pagination ?? {};
      const query: StrapiGetListQuery = {};

      if (sort) {
        query.sort = [`${sort.field}:${sort.order}`];
      }
      if (pagination) {
        query.pagination = {
          page,
          pageSize: perPage,
        };
      }
      if (filter) {
        query.filters = toStrapiFilter(filter);
      }
      const queryStringify = qs.stringify(query, {
        encodeValuesOnly: true,
      });
      const url = `${API_URL}/${resource}?${POPULATE_ALL}&${queryStringify}`;
      const { data, meta } = await httpClient(url).then((res) => res.json);

      return {
        data: data.map(toRaRecord),
        total: meta.pagination.total,
      };
    },
    getManyReference: async (
      resource,
      { target, id, pagination, sort, filter }
    ) => {
      const query: StrapiGetManyReferenceQuery = {};
      if (sort) {
        query.sort = [`${sort.field}:${sort.order}`];
      }
      if (pagination) {
        query.pagination = {
          page: pagination.page,
          pageSize: pagination.perPage,
        };
      }
      if (filter) {
        query.filters = toStrapiFilter({
          ...filter,
          [target.split(".").join("][")]: {
            documentId: id,
          },
        });
      }

      const queryStringify = qs.stringify(query, {
        encodeValuesOnly: true,
      });
      const url = `${API_URL}/${resource}?${POPULATE_ALL}&${queryStringify}`;

      const { data, meta } = await httpClient(url).then((res) => res.json);
      return { data: data.map(toRaRecord), total: meta.pagination.total };
    },
    getOne: async (resource, { id }) => {
      const url = `${API_URL}/${resource}/${id}?${POPULATE_ALL}`;
      const { data } = await httpClient(url).then((res) => res.json);
      return { data: toRaRecord(data) };
    },
    getMany: async (resource, { ids }) => {
      const query = {
        filters: {
          documentId: {
            $in: ids,
          },
        },
      };
      const queryStringify = qs.stringify(query, {
        encodeValuesOnly: true,
      });
      const url = `${API_URL}/${resource}?${queryStringify}`;
      const { data } = await httpClient(url).then((res) => res.json);
      return { data: data.map(toRaRecord) };
    },
    update: async (resource, params) => {
      const strapiUpdateParam = toStrapiBody(params);
      const url = `${API_URL}/${resource}/${params.id}`;

      const { data } = await httpClient(url, {
        method: "PUT",
        body: strapiUpdateParam,
      }).then((res) => res.json);

      return { data: toRaRecord(data) };
    },
    create: async (resource, params) => {
      const strapiUpdateParam = toStrapiBody(params);
      const url = `${API_URL}/${resource}`;

      const { data: createdData } = await httpClient(url, {
        method: "POST",
        body: strapiUpdateParam,
      }).then((res) => res.json);

      return { data: toRaRecord(createdData) };
    },
    delete: async (resource, { id }) => {
      const url = `${API_URL}/${resource}/${id}`;
      await httpClient(url, {
        method: "DELETE",
      });
      return { data: { id } } as any;
    },
    deleteMany: async (resource, { ids }) => {
      await Promise.all(
        ids.map((id) =>
          httpClient(`${API_URL}/${resource}/${id}`, {
            method: "DELETE"
          })
        )
      );
      return { data: ids.map((id) => ({ id })) } as any;
    },
    updateMany: async (resource, params) => {
      const updatedData = await Promise.all(
        params.ids.map(async (id) => {
          const { data } = await httpClient(`${API_URL}/${resource}/${id}`, {
              method: "PUT",
              body: JSON.stringify(params.data),
            })
            .then((res) => res.json);
          return data.documentId;
        })
      );
      return { data: updatedData };
    },
    supportAbortSignal: false,
  };
};
