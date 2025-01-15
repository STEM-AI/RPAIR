


// Admin.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../Layout/Layout";
import AdminDashboard from "../../../components/Dashboards/AdminDashboard/AdminDashboard";
import Teams from "../../../components/Dashboards/AdminDashboard/Teams";

const Admin = () => {

  return (
    <Routes>

      <Route
        path="/"
        element={
          <Layout>
            <AdminDashboard />
          </Layout>
        }
      />
      <Route
        path="/Dashboard/Admin/Teams"
        element={
          <Layout>
            <Teams />
          </Layout>
        }
      />
    </Routes>
  );
};

export default Admin;
