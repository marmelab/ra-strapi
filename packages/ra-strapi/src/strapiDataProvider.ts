import { DataProvider, GetListParams } from "react-admin";
import qs from "qs";

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
  filter?: any;
};
type StrapiGetManyReferenceQuery = {
  pagination?: StrapiPagination;
  sort?: string[];
  filter?: any;
};

const toRaRecord = (data: any) => {
  const { documentId, id, blocks, ...attributes } = data;
  return {
    id: documentId,
    ref: id,
    ...toRaAttributes(attributes),
  };
};

const toRaAttributes = (attributes: any) => {
  Object.keys(attributes).forEach((key: string) => {
    const data = attributes[key];
    if (!data) return;
    // it's an strapi object
    if (data.documentId) {
      attributes[key] = data.documentId;
    }
    // it's an array of strapi objects
    if (Array.isArray(data) && data.length > 0 && data[0]?.documentId) {
      attributes[key] = data.map((item: any) => item.documentId);
    }
  });

  return attributes;
};

const raFilterToStrapi = (raFilter: any) => {
  if (!raFilter) return null;
  let filters: any = {};

  Object.keys(raFilter).forEach((key) => {
    if (typeof raFilter[key] === "object") {
      return (filters[key] = raFilterToStrapi(raFilter[key]));
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

export type StrapiDataProviderConf = {
  baseURL: string;
  authToken: string;
};
export const strapiDataProvider = (
  config: StrapiDataProviderConf
): Required<DataProvider> => {
  const API_URL = `${config.baseURL}/api`;
  const UPLOADS_URL = `${config.baseURL}/uploads`;
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
        query.filter = raFilterToStrapi(filter);
      }
      const queryStringify = qs.stringify(query, {
        encodeValuesOnly: true,
      });
      const url = `${API_URL}/${resource}?${POPULATE_ALL}&${queryStringify}`;
      const { data, meta } = await fetch(url).then((res) => res.json());

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
        query.filter = raFilterToStrapi(
          {
            ...filter,
            [target.split(".").join("][")]: id,
          });
      }

      const queryStringify = qs.stringify(query, {
        encodeValuesOnly: true,
      });
      const url = `${API_URL}/${resource}?${POPULATE_ALL}&${queryStringify}`;
      console.log(`getManyReference: ${url}`);

      const { data, meta } = await fetch(url).then((res) => res.json());
      return { data: data.map(toRaRecord), total: meta.pagination.total };
    },
    getOne: async (resource, { id }) => {
      const url = `${API_URL}/${resource}/${id}`;
      const { data } = await fetch(url).then((res) => res.json());
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
      const { data } = await fetch(url).then((res) => res.json());
      return { data: data.map(toRaRecord) };
    },
    update: async (resource, { id, data, meta }) => {
      const updatedData = {};
      return { data: toRaRecord(updatedData) };
    },
    create: async (resource, { data, meta }) => {
      const createdData = {};

      return { data: toRaRecord(createdData) };
    },
    delete: async (resource, { id }) => {
      return { data: { id } } as any;
    },
    deleteMany: async (resource, { ids }) => {
      return { data: ids.map((id) => ({ id })) } as any;
    },
    updateMany: async (resource, { ids, data, meta }) => {
      const updatedData = [];
      return { data: updatedData.map(toRaRecord) };
    },
    supportAbortSignal: false,
  };
};
