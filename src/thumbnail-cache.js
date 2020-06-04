exports.thumbnailGenerationJobs = (() => {
  const cacheKey = `__gatsby-page-thumbnails-definitions`;

  return {
    initialize: async (cache) => {
      await cache.set(cacheKey, []);
    },
    add: async (cache, thumbnailMetadata) => {
      const metadataCache = await cache.get(cacheKey);
      metadataCache.push(thumbnailMetadata);
      await cache.set(cacheKey, metadataCache);
    },
    getAll: async (cache) => {
      return await cache.get(cacheKey);
    },
  };
})();
