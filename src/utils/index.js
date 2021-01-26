export const decodeURLParams = search => {
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  return hashes.reduce((params, hash) => {
    const split = hash.indexOf('=');
    const key = hash.slice(0, split);
    const val = hash.slice(split + 1);
    return Object.assign(params, { [key]: decodeURIComponent(val) });
  }, {});
};

