import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import "./AdminDashboard.css";
const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card">
              <h2 className="card-header">Admin Dashboard</h2>
              <table className="table">
                <tbody>
                  <tr>
                    <th scope="row">Name</th>
                    <td>{auth?.user?.name}</td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td>{auth?.user?.email}</td>
                  </tr>
                  <tr>
                    <th scope="row">Contact</th>
                    <td>{auth?.user?.phone}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
