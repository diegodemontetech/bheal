import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import Contacts from './pages/Contacts';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Quotes from './pages/Quotes';
import ClientRegistration from './pages/ClientRegistration';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/pipeline/:pipelineId" element={
          <PrivateRoute>
            <Layout>
              <Pipeline />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/contacts" element={
          <PrivateRoute>
            <Layout>
              <Contacts />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/calendar" element={
          <PrivateRoute>
            <Layout>
              <Calendar />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/reports" element={
          <PrivateRoute>
            <Layout>
              <Reports />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <Layout>
              <Settings />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/products" element={
          <PrivateRoute>
            <Layout>
              <Products />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/cart" element={
          <PrivateRoute>
            <Layout>
              <Cart />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/quotes" element={
          <PrivateRoute>
            <Layout>
              <Quotes />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/client-registration" element={
          <PrivateRoute>
            <Layout>
              <ClientRegistration />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;