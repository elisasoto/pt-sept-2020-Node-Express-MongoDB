const route = require("express").Router();
const { toLower, capitalize } = require("../utils/common.utils");
const NeasSchema = require("../models/Neas");

// 1. GET para obtener la designación y el período anual en base a la clase orbital del asteroide (con query params)
// - Ejemplo: `/astronomy/neas?class=aten`

route.get("/", async (req, res, next) => {
  try {
    const { orbitClass } = req.query;
    const result = await NeasSchema.find(
      { orbitClass: capitalize(orbitClass) },
      {
        designation: 1,
        periodYr: 1,
        _id: 0,
        orbitClass: 1,
      }
    );
    console.info("> neas retrieved: ", result);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("> error retrieving all neas: ", error.message);

    next(new Error("error retrieving neas"));
  }
});

// 2. GET para obtener designación, fecha y período anual de todos los asteroides que cumplan el filtro de fechas dadas
//       * `http://localhost:3000/astronomy/neas/date?from=2010&to=2015`
//       * `/astronomy/neas?from=2010`
//       * `/astronomy/neas?to=2015`
//       * En este caso, además, podremos poner la fecha más específica si quisiéramos:
//         - `YYYY-MM-DD` // http://localhost:3000/astronomy/neas/date?specific=2011-09-16
//         - `YYYY-MM`
//         - `YYYY`
//       * El endpoint debe ser compatible con los 3 casos

// funcion from -to para iso date pillar solo el dia que necesitamos ya que la bd guardo 24 horas mas y hay que restar un dia adelante
const getDateQuery = (from, to) => ({
  $gte: from,
  $lte: to,
});

route.get("/date", async (req, res, next) => {
  try {
    const { from, to, specific } = req.query;

    const baseDate = new Date(specific);
    const datePlusOne = new Date(
      new Date(specific).setDate(baseDate.getDate() + 1)
    );

    const result = await NeasSchema.find({
      discoveryDate: {
        ...(specific ? getDateQuery(baseDate, datePlusOne) : {}),
        ...(from ? { $gte: from } : {}),
        ...(to ? { $lte: to } : {}),
      },
    });

    console.info("> neas retrieved: ", result);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("> error retrieving all neas: ", error.message);

    next(new Error("error retrieving neas"));
  }
});

//  GET para obtener designación, fecha y período anual de todos aquellos asteroides que sean potencialmente peligrosos
//   3.  - Ejemplo: `/astronomy/neas?pha=1`
//  4  - Ejemplo: `/astronomy/neas?pha=0 => no es PHA
// 5  - Ejemplo: `/astronomy/neas?pha=-1 => no se sabe si es pha
//     * Esto se calcula de dos maneras distintas:
//       1. El campo `PHA` (potentially hazardous asteroids) deberá contener "Y" en lugar de "N"
//       2. El campo `moid_au` (minimum orbit intersection distance) medido en unidades astronómicas (`1au ~ 150000000km`) debe ser menor o igual que `0.05` y la magnitud absoluta (H) del asteroide (campo `h_mag`) debe ser menor o igual que `22.0`

//     * Debeis comprobar que ambos puntos se cumplen para poder devolver la información
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

route.get("/", async (req, res, next) => {
  try {
    const { pha } = req.query;

    const result = await NeasSchema.find(phaFindOptions(pha), {
      designation: 1,
      periodYr: 1,
      _id: 0,
      discoveryDate: 1,
    });

    console.info("> neas retrieved: ", result);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("> error retrieving all neas: ", error.message);

    next(new Error("error retrieving neas"));
  }
});


// 6. GET para obtener designación, fecha y período anual de todos aquellos asteroides que cumplan la condición del período anual especificado
// * `/astronomy/neas/periods?from=36&to=900`
// * `/astronomy/neas/periods?from=36`
// * `/astronomy/neas/periods?to=900`
// * El endpoint debe ser compatible con las 3 formas

route.get("/periods", async (req, res, next) => {
    try {
      const { from, to } = req.query;
        
      
      const result = await NeasSchema.find({
        periodYr: {
          ...(from ? { $gte: Number(from) } : {}),
          ...(to ? { $lte: Number(to) } : {}),
        },
      });
  
      console.info("> landings retrieved: ", result);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("> error retrieving all landings: ", error.message);
  
      next(new Error("error retrieving landings"));
    }
  });

module.exports = route;
