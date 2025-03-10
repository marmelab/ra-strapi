export const filtersBuilder = (filters: object): object => {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    return {
      ...acc,
      ...generateFilter(key, value),
    };
  }, {});
};

/**
 * Generate a filter string for Strapi
 * @returns Strapi filter strapi object
 */
const generateFilter = (key: string, value: any): object => {
  if (key.endsWith("_eq")) {
    return {
      [key.slice(0, -3)]: value,
    };
  }
  if (key.endsWith("_eqi")) {
    return {
      [key.slice(0, -4)]: {
        $eqi: value,
      },
    };
  }
  if (key.endsWith("_ne")) {
    return {
      [key.slice(0, -3)]: {
        $ne: value,
      },
    };
  }
  if (key.endsWith("_nei")) {
    return {
      [key.slice(0, -4)]: {
        $nei: value,
      },
    };
  }
  if (key.endsWith("_gt")) {
    return {
      [key.slice(0, -3)]: {
        $gt: value,
      },
    };
  }
  if (key.endsWith("_gte")) {
    return {
      [key.slice(0, -4)]: {
        $gte: value,
      },
    };
  }
  if (key.endsWith("_lt")) {
    return {
      [key.slice(0, -3)]: {
        $lt: value,
      },
    };
  }
  if (key.endsWith("_lte")) {
    return {
      [key.slice(0, -4)]: {
        $lte: value,
      },
    };
  }
  if (key.endsWith("_contains")) {
    return {
      [key.slice(0, -9)]: {
        $contains: value,
      },
    };
  }
  if (key.endsWith("_ncontains")) {
    return {
      [key.slice(0, -9)]: {
        $notContains: value,
      },
    };
  }
  if (key.endsWith("_containsi")) {
    return {
      [key.slice(0, -9)]: {
        $containsi: value,
      },
    };
  }
  if (key.endsWith("_ncontainsi")) {
    return {
      [key.slice(0, -9)]: {
        $notContainsi: value,
      },
    };
  }
  if (key.endsWith("_between")) {
    if (!Array.isArray(value) || value.length !== 2) {
      throw new Error(
        `Value array must contain exactly two elements for "between" operator`
      );
    }
    return {
      [key.slice(0, -8)]: {
        $between: value,
      },
    };
  }
  if (key.endsWith("_in")) {
    if (!Array.isArray(value)) {
      throw new Error(`Value must be an array for "in" operator`);
    }
    return {
      [key.slice(0, -3)]: {
        $in: value,
      },
    };
  }
  if (key.endsWith("_nin")) {
    if (!Array.isArray(value)) {
      throw new Error(`Value must be an array for "nin" operator`);
    }
    return {
      [key.slice(0, -4)]: {
        $notIn: value,
      },
    };
  }
  if (key.endsWith("_isnull")) {
    return {
      [key.slice(0, -7)]: {
        $null: true,
      },
    };
  }
  if (key.endsWith("_isnotnull")) {
    return {
      [key.slice(0, -10)]: {
        $notNull: true,
      },
    };
  }
  if (key.endsWith("_startswith")) {
    return {
      [key.slice(0, -11)]: {
        $startsWith: value,
      },
    };
  }
  if (key.endsWith("_startswithi")) {
    return {
      [key.slice(0, -11)]: {
        $startsWithi: value,
      },
    };
  }
  if (key.endsWith("_endswith")) {
    return {
      [key.slice(0, -9)]: {
        $endsWith: value,
      },
    };
  }
  if (key.endsWith("_endswithi")) {
    return {
      [key.slice(0, -9)]: {
        $endsWithi: value,
      },
    };
  }
  return {
    [key]: value,
  }
};


