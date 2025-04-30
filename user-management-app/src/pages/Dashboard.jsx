import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", job: "" });
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchUsers = async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(`https://reqres.in/api/users?page=${pageNum}`, {
        headers: {
          "x-api-key": "reqres-free-v1",
        },
      });
      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!newUser.name || !newUser.job) {
      setFormError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "reqres-free-v1",
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (res.ok) {
        const nameParts = newUser.name.trim().split(" ");
        const newAddedUser = {
          id: Date.now(), // temporary ID
          email: `${nameParts[0] || "new"}@reqres.in`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            newUser.name
          )}&background=random`,

          first_name: nameParts[0] || newUser.name,
          last_name: nameParts[1] || "",
        };
        setUsers((prev) => [newAddedUser, ...prev]);
        setNewUser({ name: "", job: "" });
        setShowForm(false);
      } else {
        setFormError("Failed to add user");
      }
    } catch (err) {
      setFormError("Network error");
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filtered = users.filter((user) =>
        `${user.first_name} ${user.last_name} ${user.email}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    }, 400); // debounce delay in ms

    return () => clearTimeout(delayDebounce);
  }, [search, users]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, []);

  return (
    <div className="w-screen  overflow-y-auto p-6 bg-gradient-to-br from-purple-100 to-purple-300">
      <div className="max-w-5xl w-full overflow-y-auto px-4 mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-purple-700">User Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700  hover:border-green-600">
              {showForm ? "Cancel" : "Add New User"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 hover:border-red-500">
              Logout
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-purple-50 p-2 mb-2 border rounded"
        />

        {showForm && (
          <form
            onSubmit={handleAddUser}
            className="bg-white p-4 rounded shadow mb-4 space-y-2">
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Job"
              value={newUser.job}
              onChange={(e) => setNewUser({ ...newUser, job: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Submit
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-gray-600">Loading users...</p>
        ) : (
          <table className="w-full table-auto bg-purple-50 shadow-md rounded overflow-hidden">
            <thead className="bg-purple-400 text-left">
              <tr>
                <th className="p-3">Avatar</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {/* {users.map((user) => ( */}
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">
                    <img
                      src={user.avatar}
                      alt={user.first_name}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="p-3">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="p-3">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 rounded bg-white-300 disabled:opacity-50"
            disabled={page === 1}>
            Previous
          </button>

          {[1, 2].map((pg) => (
            <button
              key={pg}
              onClick={() => setPage(pg)}
              className={`px-3 py-1 rounded border ${
                page === pg ? "bg-purple-600 text-white" : "bg-white"
              }`}>
              {pg}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1 rounded bg-white-300">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
