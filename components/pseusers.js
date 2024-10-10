import { useState, useEffect } from "react";
import UsersData from "/public/users.json";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid"; // Import uuid

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserPassword, setEditUserPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // New state for sorting order

  useEffect(() => {
    setUsers(UsersData);
  }, []);

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserPassword(user.password);
  };

  const handleSave = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id
        ? {
            ...user,
            name: editUserName,
            email: editUserEmail,
            password: editUserPassword,
          }
        : user
    );
    setUsers(updatedUsers);
    setEditUserId(null);
    setEditUserName("");
    setEditUserEmail("");
    setEditUserPassword("");
  };

  const handleDelete = async (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);

    try {
      const res = await fetch(`/api/deleteUser`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        console.error("Failed to delete user from server.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
  };
  const getNextId = (users) => {
    const existingIds = users.map((user) => user.id);
    let nextId = 1;

    while (existingIds.includes(nextId)) {
      nextId++;
    }

    return nextId;
  };
  const sortUsers = (users) => {
    return [...users].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.id - b.id; // Sort ascending by ID
      } else {
        return b.id - a.id; // Sort descending by ID
      }
    });
  };

  const handleCreateUser = async () => {
    const newUserId = getNextId(users); // Get the next available ID
    const newUser = {
      id: newUserId,
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
    };

    try {
      const res = await fetch("/api/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        closeModal();
      } else {
        console.error("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toString().includes(searchQuery)
    );
  });

  const displayedUsers = sortUsers(filteredUsers);

  return (
    <div className="bg-[#242424] p-6 h-full w-full shadow-md">
      <h2 className="text-2xl font-semibold text-white mb-4">
        User Management
      </h2>
      <button
        onClick={openModal}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Create New User
      </button>
      <button
        onClick={() =>
          setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
        }
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 ml-4"
      >
        Sort by ID: {sortOrder === "asc" ? "Newest First" : "Oldest First"}
      </button>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by ID, Name, or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-[#2A2A2A] text-white"
        />
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        <table className="min-w-full bg-[#2A2A2A] text-white border border-gray-700 rounded-lg shadow-md">
          <thead className="sticky top-0 bg-[#1B1B1B] z-10">
            <tr>
              <th className="border px-4 py-2 w-1/12">ID</th>
              <th className="border px-4 py-2 w-3/12">Name</th>
              <th className="border px-4 py-2 w-4/12">Email</th>
              <th className="border px-4 py-2 w-3/12">Password</th>
              <th className="border px-1 py-2 w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-600">
                  <td className="border px-4 py-2 h-12">{user.id}</td>
                  <td className="border px-4 py-2 h-12">
                    {editUserId === user.id ? (
                      <input
                        type="text"
                        value={editUserName}
                        onChange={(e) => setEditUserName(e.target.value)}
                        className="border rounded px-2 py-1 text-black"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="border px-4 py-2 h-12">
                    {editUserId === user.id ? (
                      <input
                        type="text"
                        value={editUserEmail}
                        onChange={(e) => setEditUserEmail(e.target.value)}
                        className="border rounded px-2 py-1 text-black"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="border px-4 py-2 h-12">
                    {editUserId === user.id ? (
                      <input
                        type={showPassword[user.id] ? "text" : "password"}
                        value={editUserPassword}
                        onChange={(e) => setEditUserPassword(e.target.value)}
                        className="border rounded px-2 py-1 text-black"
                        placeholder="New Password"
                      />
                    ) : (
                      "••••••••"
                    )}
                  </td>
                  <td className="border px-1 py-2 flex justify-center items-center space-x-2 h-12">
                    {editUserId === user.id ? (
                      <>
                        <button
                          onClick={() => handleSave(user.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded transition duration-200 hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="text-white"
                          title={
                            showPassword[user.id]
                              ? "Hide Password"
                              : "Show Password"
                          }
                        >
                          {showPassword[user.id] ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-500 text-white p-2 rounded transition duration-200 hover:bg-blue-600"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 text-white p-2 rounded transition duration-200 hover:bg-red-600"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="border px-4 py-2 text-center text-gray-400"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Create New User</h2>
            <input
              type="text"
              placeholder="Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="border rounded px-3 py-2 mb-4 w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="border rounded px-3 py-2 mb-4 w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              className="border rounded px-3 py-2 mb-4 w-full"
            />
            <div className="flex justify-between">
              <button
                onClick={handleCreateUser}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Create
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), "public", "users.json");
  const usersData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  return {
    props: {
      initialUsers: usersData,
    },
  };
}

export default UserTable;
