const router = require("express").Router();
const clientRoutes = require("./client");

router.get("/", (req, res) => {
  res.send({ message: "App is working!" });
});

router.use("/clients", clientRoutes);

module.exports = router;
