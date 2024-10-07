// components/UserTable.js
import { useState, useEffect } from "react";
import UsersData from "/public/users.json"; // Update this path

const UserTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(UsersData); // Set the initial users from your JSON data
  }, []);

  const [editUserId, setEditUserId] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserPassword, setEditUserPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle editing user
  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
  };

  // Function to handle saving edited user
  const handleSave = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id
        ? { ...user, name: editUserName, email: editUserEmail }
        : user
    );
    setUsers(updatedUsers);
    setEditUserId(null);
    setEditUserName("");
    setEditUserEmail("");
    setEditUserPassword("");
  };
  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toString().includes(searchQuery)
    );
  });

  // Function to handle deleting user
  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  return (
    <div className="h-[90%] w-[90%] overflow-x-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by ID, Name, or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
      </div>
      <div className="overflow-y-auto h-[calc(100vh-100px)]">
        {" "}
        {/* Adjust height for scrollable area */}
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Password</th>{" "}
              {/* Added Password column */}
              <th className="border px-4 py-2 w-1/4">Actions</th>{" "}
              {/* Adjusted width */}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">
                    {editUserId === user.id ? (
                      <input
                        type="text"
                        value={editUserName}
                        onChange={(e) => setEditUserName(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editUserId === user.id ? (
                      <input
                        type="text"
                        value={editUserEmail}
                        onChange={(e) => setEditUserEmail(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editUserId === user.id ? (
                      <input
                        type="password" // Input type for password
                        value={editUserPassword}
                        onChange={(e) => setEditUserPassword(e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="New Password" // Placeholder for clarity
                      />
                    ) : (
                      user.password // Mask the password when not editing
                    )}
                  </td>
                  <td className="border px-4 py-2 flex justify-around">
                    {" "}
                    {/* Flex for spacing actions */}
                    {editUserId === user.id ? (
                      <button
                        onClick={() => handleSave(user.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded transition duration-200 hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-500 text-white px-3 py-1 rounded transition duration-200 hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded transition duration-200 hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border px-4 py-2 text-center">
                  {" "}
                  {/* Adjusted colspan */}
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
