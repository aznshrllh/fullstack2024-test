const { Client } = require("../models");
const { setAsync, getAsync, delAsync } = require("../config/redis");
const { s3 } = require("../config/aws");
const fs = require("fs");
const path = require("path");

class ClientController {
  // Get all clients
  static async getAllClients(req, res) {
    try {
      const clients = await Client.findAll({
        where: {
          deleted_at: null,
        },
      });
      res.status(200).json(clients);
    } catch (error) {
      console.error("Error in getAllClients:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get client by ID
  static async getClientById(req, res) {
    try {
      const { id } = req.params;
      const client = await Client.findByPk(id);

      if (!client || client.deleted_at !== null) {
        return res.status(404).json({ message: "Client not found" });
      }

      res.status(200).json(client);
    } catch (error) {
      console.error("Error in getClientById:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get client from Redis by slug
  static async getClientBySlug(req, res) {
    try {
      const { slug } = req.params;

      // Try to get from Redis first
      const cachedClient = await getAsync(slug);

      if (cachedClient) {
        console.log("Retrieved from Redis cache");
        return res.status(200).json(JSON.parse(cachedClient));
      }

      // If not in Redis, get from database
      const client = await Client.findOne({
        where: {
          slug,
          deleted_at: null,
        },
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      // Store in Redis for future requests
      await setAsync(slug, JSON.stringify(client));
      console.log("Cached in Redis");

      res.status(200).json(client);
    } catch (error) {
      console.error("Error in getClientBySlug:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // Create a new client
  static async createClient(req, res) {
    try {
      const {
        name,
        slug,
        is_project,
        self_capture,
        client_prefix,
        address,
        phone_number,
        city,
      } = req.body;

      console.log("Creating client with data:", req.body);

      // If image uploaded, use file URL, otherwise use default
      let client_logo = "no-image.jpg";
      if (req.file) {
        client_logo = req.file.location;
        console.log("Using uploaded image:", client_logo);
      }

      const client = await Client.create({
        name,
        slug,
        is_project,
        self_capture,
        client_prefix,
        client_logo,
        address,
        phone_number,
        city,
      });

      // Store in Redis with slug as key
      await setAsync(slug, JSON.stringify(client));
      console.log("Client created and cached in Redis");

      res.status(201).json(client);
    } catch (error) {
      console.error("Error in createClient:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // Update a client
  static async updateClient(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        slug,
        is_project,
        self_capture,
        client_prefix,
        address,
        phone_number,
        city,
      } = req.body;

      const client = await Client.findByPk(id);

      if (!client || client.deleted_at !== null) {
        return res.status(404).json({ message: "Client not found" });
      }

      console.log("Updating client:", id);

      // Check if need to update logo
      let client_logo = client.client_logo;
      if (req.file) {
        // Delete the old image if it's not the default
        if (
          client.client_logo !== "no-image.jpg" &&
          !client.client_logo.includes("no-image.jpg")
        ) {
          try {
            // Extract filename from URL
            const oldFileName = client.client_logo.split("/").pop();
            const filePath = path.join(
              __dirname,
              "..",
              "uploads",
              "client-logos",
              oldFileName
            );

            console.log("Attempting to delete file:", filePath);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log("Old logo deleted");
            }
          } catch (error) {
            console.error("Error deleting old file:", error);
          }
        }
        client_logo = req.file.location;
        console.log("New logo:", client_logo);
      }

      // Delete from Redis before updating
      await delAsync(client.slug);
      console.log("Deleted from Redis cache");

      const oldSlug = client.slug;

      await client.update({
        name: name || client.name,
        slug: slug || client.slug,
        is_project: is_project || client.is_project,
        self_capture: self_capture || client.self_capture,
        client_prefix: client_prefix || client.client_prefix,
        client_logo,
        address: address !== undefined ? address : client.address,
        phone_number:
          phone_number !== undefined ? phone_number : client.phone_number,
        city: city !== undefined ? city : client.city,
      });

      console.log("Client updated in database");

      // Store updated client in Redis with new slug
      await setAsync(client.slug, JSON.stringify(client));
      console.log("Updated client cached in Redis");

      res.status(200).json(client);
    } catch (error) {
      console.error("Error in updateClient:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // Soft delete a client
  static async deleteClient(req, res) {
    try {
      const { id } = req.params;
      const client = await Client.findByPk(id);

      if (!client || client.deleted_at !== null) {
        return res.status(404).json({ message: "Client not found" });
      }

      console.log("Soft deleting client:", id);

      // Delete from Redis
      await delAsync(client.slug);
      console.log("Deleted from Redis cache");

      // Soft delete (set deleted_at)
      await client.update({ deleted_at: new Date() });
      console.log("Client soft deleted");

      res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
      console.error("Error in deleteClient:", error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ClientController;
