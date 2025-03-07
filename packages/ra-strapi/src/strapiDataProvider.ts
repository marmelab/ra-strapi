import qs from "qs";
import {
  CreateParams,
  DataProvider,
  UpdateParams,
  fetchUtils,
} from "react-admin";
import { filtersBuilder } from "./filtersBuilder";

const POPULATE_ALL = "populate=*";

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
const strapiToRaRecord = (baseURL: string) => {
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
    },
  };
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

export type StrapiDataProviderConf = {
  baseURL: string;
  httpClient?: any;
};

/**
 * Returns a dataProvider that can be used with react-admin.
 *
 * @param baseURL **Required** - The base URL of the Strapi API.
 * @param httpClient *Optional* - The httpClient to use. Default to fetchUtils.fetchJson
 *
 * @example
 * ```ts
 * const dataProvider = strapiDataProvider({ baseURL: STRAPI_URL }); // It will use the default httpClient
 * ```
 * or
 * ```ts
 * const dataProvider = strapiDataProvider({ baseURL: STRAPI_URL, httpClient }); // If you want to use a custom httpClient
 * ```
 */
export const strapiDataProvider = ({
  baseURL,
  httpClient = fetchUtils.fetchJson,
}): Required<DataProvider> => {
  const API_URL = `${baseURL}/api`;

  const { toRaRecord } = strapiToRaRecord(baseURL);

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
        query.filters = filtersBuilder(filter);
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
        query.filters = filtersBuilder({
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
            method: "DELETE",
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
          }).then((res) => res.json);
          return data.documentId;
        })
      );
      return { data: updatedData };
    },
    supportAbortSignal: false,
  };
};
