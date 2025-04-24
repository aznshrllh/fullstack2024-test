const router = require("express").Router();
const ClientController = require("../controllers/ClientController");
const upload = require("../middlewares/upload");

// Order matters for routes with parameters
router.get("/slug/:slug", ClientController.getClientBySlug);
router.get("/:id", ClientController.getClientById);
router.get("/", ClientController.getAllClients);
router.post(
  "/",
  ...upload.single("client_logo"),
  ClientController.createClient
);
router.put(
  "/:id",
  ...upload.single("client_logo"),
  ClientController.updateClient
);
router.delete("/:id", ClientController.deleteClient);

module.exports = router;
