const route = require("express").Router();
const UsersSchema = require("../models/Users");
const fns = require("date-fns");

// Endpoints relativos a Users
// http://localhost:3000/astronomy/guild
// 1. POST para poder unirte a la asociación de astronomía
route.post("/", async (req, res, next) => {
  try {
    const newUserData = req.body;
    const newUser = await UsersSchema.create({
      name: newUserData.name,
      nickname: newUserData.nickname,
      affiliatedNumber: newUserData.affiliatedNumber,
      affiliationDate: fns.format(
        new Date(newUserData.affiliationDate),
        "yyyy-MM-dd"
      ),
      occupation: newUserData.occupation,
      birthdate: fns.format(new Date(newUserData.birthdate), "yyyy-MM-dd"),
    });

    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error("> error posting a new user: ", error.message);

    next(new Error("error retrieving users"));
  }
});

// 2. GET para obtener nombre, edad (*sí, edad, no fecha de nacimiento*), ocupación, número de afiliado, puntos y fecha de afiliación de un usuario dado su número de afiliación
//     - Ejemplo: `/astronomy/guild/123-23-45-33Y`

route.get("/:aff", async (req, res, next) => {
  try {
    const foundUser = await UsersSchema.findOne(
      { affiliatedNumber: Number(req.params.aff) },
      {
        name: 1,
        occupation: 1,
        affiliatedNumber: 1,
        astronomicalPoints: 1,
        _id: 1,
        affiliationDate: 1,
        birthdate: 1,
      }
    );
    const userBirthday = foundUser.get("birthdate");
    const dateNow = new Date();
    const calculatedAge = fns.differenceInYears(
      new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()),
      new Date(
        userBirthday.getFullYear(),
        userBirthday.getMonth(),
        userBirthday.getDate()
      )
    );

    const userWithAge = await UsersSchema.findOneAndUpdate(
      { _id: foundUser._id },
      {
        age: calculatedAge,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: userWithAge,
    });
  } catch (error) {
    console.error("> error getting a new user: ", error.message);

    next(new Error("error retrieving users"));
  }
});

// endpoints 3, 4 ,5 y 6, funcion 

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

route.get("/:aff/:options", async (req, res, next) => {
  try {
    const result = await UsersSchema.find(
      { affiliatedNumber: Number(req.params.aff) },
      urlOption(req)
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("> error getting a new user: ", error.message);

    next(new Error("error retrieving users"));
  }
});

route.put('/', async(req,res,next)=>{


})

module.exports = route;
