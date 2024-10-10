import fs from "fs";
import path from "path";
const filePath = path.join(process.cwd(), "public", "users.json");

export default function handler(req, res) {
  if (req.method === "POST") {
    const newUser = req.body;
    const usersData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    usersData.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(usersData, null, 2));
    res
      .status(200)
      .json({ message: "User added successfully", users: usersData });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
