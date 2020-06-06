exports.imageGenerationJobCache = (() => {
  const cacheKey = `__gatsby-plugin-open-graph-images`;

  return {
    init: async (cache) => {
      await cache.set(cacheKey, []);
    },
    add: async (cache, imageMetadata) => {
      const metadataCache = await cache.get(cacheKey);
      metadataCache.push(imageMetadata);
      await cache.set(cacheKey, metadataCache);
    },
    getAll: async (cache) => {
      return await cache.get(cacheKey);
    },
  };
})();
