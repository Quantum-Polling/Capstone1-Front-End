import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import SearchField from "./SearchField";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/users`, {
          withCredentials: true,
        });
        console.log("Fetched users:", response.data);
        setUsers(response.data);
        setFilteredUsers(response.data); // set initially to all users
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    const q = query.toLowerCase();
    if (!q.trim()) {
      setFilteredUsers(users); // reset if input is cleared
    } else {
      const results = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(q) ||
          user.lastName.toLowerCase().includes(q)
      );
      setFilteredUsers(results);
    }
  };

  const handleDisable = async (userId) => {
    try {
      // Call backend to disable the user
      await axios.patch(
        `${API_URL}/auth/${userId}/disable`,
        {},
        {
          withCredentials: true,
        }
      );

      // Refresh the user list from backend
      const res = await axios.get(`${API_URL}/auth/users`, {
        withCredentials: true,
      });

      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error(
        "Failed to disable user:",
        err.response?.data || err.message
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <SearchField onSearch={handleSearch} />
      <div className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div className="user-card" key={user.id}>
              <img
                src={user.avatarURL || "https://via.placeholder.com/80"}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <h3>{`${user.firstName} ${user.lastName}`}</h3>
              <p>{user.email}</p>
              <p className="role">Role: {user.role || "N/A"}</p>

              {user.disabled ? (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Account Disabled
                </p>
              ) : (
                <button
                  className="disable-button"
                  onClick={() => handleDisable(user.id)}
                >
                  Disable
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default UserList;
