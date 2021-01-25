const urlOption = (url) =>
  url.params.options === "badges"
    ? { affiliatedNumber: 1, badges: 1, _id: 0 }
    : url.params.options === "neas"
    ? { affiliatedNumber: 1, neasDiscovered: 1, _id: 0 }
    : url.params.options === "necs"
    ? { affiliatedNumber: 1, necsDiscovered: 1, _id: 0 }
    : url.params.options === "points"
    ? { affiliatedNumber: 1, astronomicalPoints: 1, _id: 0 }
    : {};

module.exports = {
  urlOption,
};
