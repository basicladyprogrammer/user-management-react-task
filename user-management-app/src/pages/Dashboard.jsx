import { useEffect, useState } from "react";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

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

  return (
    <div className="w-screen  overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-5xl w-full overflow-y-auto px-4 mx-auto">
        <h1 className="text-2xl font-bold mb-2">User Dashboard</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />

        {loading ? (
          <p className="text-gray-600">Loading users...</p>
        ) : (
          <table className="w-full table-auto bg-white shadow-md rounded overflow-hidden">
            <thead className="bg-blue-100 text-left">
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
            className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
            disabled={page === 1}>
            Previous
          </button>

          {[1, 2].map((pg) => (
            <button
              key={pg}
              onClick={() => setPage(pg)}
              className={`px-3 py-1 rounded border ${
                page === pg ? "bg-blue-600 text-white" : "bg-white"
              }`}>
              {pg}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1 rounded bg-gray-300">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
