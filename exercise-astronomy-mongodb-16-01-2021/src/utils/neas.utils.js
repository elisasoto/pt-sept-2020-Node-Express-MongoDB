const phaFindOptions = (str) => {
  if (str === "1") {
    return {
      $and: [{ moidAu: { $lte: 0.05 } }, { hMag: { $lte: 22 } }, { pha: "Y" }],
    };
  } else if (str === "0") {
    return {
      $and: [{ moidAu: { $gte: 0.05 } }, { hMag: { $gte: 22 } }, { pha: "N" }],
    };
  } else {
    return { pha: "n/a" };
  }
};


const getDateQuery = (from, to) => ({
    $gte: from,
    $lte: to,
  });

module.exports = {
  phaFindOptions,
  getDateQuery
};
