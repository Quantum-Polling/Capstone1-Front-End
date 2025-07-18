import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/users`, {
          withCredentials: true,
        });
        console.log("Fetched users:", response.data); // optional debug
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <div className="user-card" key={user.id}>
          <img
            src={user.avatarURL || "https://via.placeholder.com/80"}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <h3>{`${user.firstName} ${user.lastName}`}</h3>
          <p>{user.email}</p>
          <p className="role">Role: {user.role || "N/A"}</p>
        </div>
      ))}
    </div>
  );
};

export default UserList;
