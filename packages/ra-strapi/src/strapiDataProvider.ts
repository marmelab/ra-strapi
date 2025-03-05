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
export type StrapiGetListParams = {
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
      attributes[key] = toRaRecord(data);
    }
    // it's an array of strapi objects
    if (Array.isArray(data) && data.length > 0 && data[0]?.documentId) {
      attributes[key] = data.map((item: any) => toRaRecord(item));
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
  return {
    getList: async (resource, { pagination, sort, filter }) => {
      const { page = 1, perPage = 10 } = pagination ?? {};

      const query: StrapiGetListParams = {};
      //     pagination: {
      //       page,
      //       pageSize: perPage,
      //     },
      //     filters: raFilterToStrapi(params.filter),
      //   };

      if (sort) {
        query.sort = [`${sort.field}:${sort.order}`];
      }
      if (pagination) {
        query.pagination = {
            page,
            pageSize: perPage,
        }
      }
      if (filter) {
        query.filter = raFilterToStrapi(filter);
      }

      const queryStringify = qs.stringify(query, {
        encodeValuesOnly: true,
      });

      const url = `${config.baseURL}/${resource}?${POPULATE_ALL}&${queryStringify}`;
      const response = await fetch(url);
      const json = await response.json();
      return {
        data: json.data.map(toRaRecord),
        total: json.meta.pagination.total,
      };
    },
    getManyReference: async (
      resource,
      { target, id, pagination, sort, filter }
    ) => {
      const { page = 1, perPage = 10 } = pagination ?? {};
      const total = 0;

      return { data: [].map(toRaRecord), total };
    },
    getOne: async (resource, { id }) => {
      const url = `${config.baseURL}/${resource}/${id}`;
      const response = await fetch(url);
      const json = await response.json();
      return { data: toRaRecord(json.data) };
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
    getMany: async (resource, { ids }) => {
      const data = [];
      return { data: data.map(toRaRecord) };
    },
    updateMany: async (resource, { ids, data, meta }) => {
      const updatedData = [];
      return { data: updatedData.map(toRaRecord) };
    },
    supportAbortSignal: false,
  };
};
