import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      // Read the users.json file
      const filePath = path.join(process.cwd(), "public", "users.json");
      const fileData = fs.readFileSync(filePath, "utf8");
      let users = JSON.parse(fileData);

      // Filter out the user with the provided id
      users = users.filter((user) => user.id !== id);

      // Write the updated users back to the file
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

      // Return the updated users in the response
      res.status(200).json({ users });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
