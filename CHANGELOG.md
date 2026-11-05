# Changelog

## Unreleased

- Publish modern ESM and CommonJS package exports ([#7](https://github.com/marmelab/ra-strapi/pull/7))

### Breaking Changes

`ra-strapi` now publishes its ES modules and CommonJS builds in `dist/`, behind an [`exports`](https://nodejs.org/api/packages.html#package-entry-points) map. Only the package root can be imported, so these undocumented paths no longer resolve:

- the old build folders: `ra-strapi/lib/*` and `ra-strapi/esm/*`
- the sources: `ra-strapi/src/*`, even though they are still published
- the manifest: `ra-strapi/package.json`
