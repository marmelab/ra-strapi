# Changelog

## v2.0.0

- Publish modern ESM and CommonJS package exports ([#7](https://github.com/marmelab/ra-strapi/pull/7))
- Fix loading `ra-strapi` in Node.js, where both `import` and `require` used to fail ([#7](https://github.com/marmelab/ra-strapi/pull/7))

### Breaking Changes

`ra-strapi` now publishes its ES modules and CommonJS builds in `dist/`, behind an [`exports`](https://nodejs.org/api/packages.html#package-entry-points) map. Only the package root can be imported, so these undocumented paths no longer resolve:

- the old build folders: `ra-strapi/lib/*` and `ra-strapi/esm/*`
- the sources: `ra-strapi/src/*`, even though they are still published
- the manifest: `ra-strapi/package.json`

## v1.0.3

- Fix api key passed via parameter instead of using a environment variable

## v1.0.2

- Fix missing qs dependency
- [Doc] Fix bad link to npmjs documentation



## v1.0.1

Initial release
