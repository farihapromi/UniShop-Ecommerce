import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [membershipId, setMembershipId] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const assignMembership = async () => {
    try {
      await axios.post("/api/admin/assign-membership", {
        userId: selectedUser,
        membershipId,
      });
      setMembershipId("");
      alert("Membership ID assigned successfully");
    } catch (error) {
      console.error("Error assigning membership ID:", error);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Total Spent</th>
            <th>Coins</th>
            <th>Membership Level</th>
            <th>Membership ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.totalSpent}</td>
              <td>{user.coins}</td>
              <td>{user.membershipLevel}</td>
              <td>{user.membershipId || "Not assigned"}</td>
              <td>
                <button onClick={() => setSelectedUser(user._id)}>
                  Assign Membership
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUser && (
        <div>
          <h2>Assign Membership ID</h2>
          <input
            type="text"
            value={membershipId}
            onChange={(e) => setMembershipId(e.target.value)}
            placeholder="Enter Membership ID"
          />
          <button onClick={assignMembership}>Assign</button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
