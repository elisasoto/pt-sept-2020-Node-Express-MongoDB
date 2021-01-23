const route = require("express").Router();
var geo = require("mapbox-geocoding");
const LandingsSchema = require("../models/Landings");
// conexion a mapbox desde la libreria mapbox en npm npm install mapbox-geocoding
geo.setAccessToken(
  "pk.eyJ1IjoiZWxpc2Fzb3RvIiwiYSI6ImNraTBqbjczdjAwNDYycHFuNXB6enUwdWoifQ.Fr7VtpdTeZuoo1CqcJcJpw"
);

// Endpoints relativos a Landings
// 1. GET para obtener nombre y masa de todos aquellos meteoritos cuya masa sea igual o superior a una masa (gr) dada (con query parameters)
route.get("/", async (req, res, next) => {
  // URL `http://localhost:3000/astronomy/landings/minimum_mass?=200000`
  try {
    const { minimum_mass } = req.query;
    const result = await LandingsSchema.find(
      { mass: { $gt: Number(minimum_mass) } },
      { name: 1, mass: 1, _id: 0 }
    );

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

// 2. GET para obtener nombre y masa de uno o más meteoritos cuya masa sea la especificada (route params)
// /astronomy/landings/mass/200000
route.get("/mass/:mass", async (req, res, next) => {
  try {
    const result = await LandingsSchema.find(
      { mass: Number(req.params.mass) },
      { name: 1, mass: 1, _id: 0 }
    );

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

//3. GET para obtener los nombres y clase de aquellos meteoritos cuya clase sea la registrada (route params)
// /astronomy/landings/class/L6
route.get("/class/:recclass", async (req, res, next) => {
  try {
    const result = await LandingsSchema.find(
      { recclass: req.params.recclass },
      { name: 1, recclass: 1, _id: 0 }
    );

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

// 4. GET para obtener nombre, masa y fecha de todos los meteoritos caídos en determinadas fechas de la siguiente manera:
//       * `/astronomy/landings/from?=1960&to?=1990`
//       * `/astronomy/landings/from?=1960`
//       * `/astronomy/landings/to?=1990`
//       * El mismo endpoint deberá ser compatible con las 3 formas

route.get("/date", async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const result = await LandingsSchema.find({
      year: {
        ...(from ? { $gte: from } : {}),
        ...(to ? { $lte: to } : {}),
      },
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("> error retrieving all landings: ", error.message);

    next(new Error("error retrieving landings"));
  }
});

//   5. GET para obtener el nombre de la ciudad, país, región o lo que corresponda a partir del nombre del meteorito
//   - Ejemplo: `/astronomy/landings/aachen`

route.get("/:name", async (req, res, next) => {
  try {
    const result = await LandingsSchema.find(
      { name: req.params.name },
      { name: 1, geolocation: 1, _id: 0, reclat: 1, reclong: 1 }
    );

    // destructuring de coordenadas dentro del array de resultado
    const [{ reclong: long, reclat: lat }] = result;

    // longitud, latitud
    geo.reverseGeocode("mapbox.places", long, lat, function (err, geoData) {
      const place = geoData.features[0];
      res.status(200).json({
        success: true,
        data: place.place_name,
      });
    });
  } catch (error) {
    console.error("> error retrieving all landings: ", error.message);

    next(new Error("error retrieving landings"));
  }
});

module.exports = route;
