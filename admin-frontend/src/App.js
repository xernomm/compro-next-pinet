import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/AdminTheme.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import CompanyInfo from './pages/Company/CompanyInfo';
import HeroList from './pages/Hero/HeroList';
import HeroForm from './pages/Hero/HeroForm';
import ServiceList from './pages/Service/ServiceList';
import ServiceForm from './pages/Service/ServiceForm';
import ValueList from './pages/Value/ValueList';
import ValueForm from './pages/Value/ValueForm';
import ProductList from './pages/Product/ProductList';
import ProductForm from './pages/Product/ProductForm';
import PartnerList from './pages/Partner/PartnerList';
import PartnerForm from './pages/Partner/PartnerForm';
import PartnerBulkAdd from './pages/Partner/PartnerBulkAdd';
import ClientList from './pages/Client/ClientList';
import ClientForm from './pages/Client/ClientForm';
import ClientBulkAdd from './pages/Client/ClientBulkAdd';
import NewsList from './pages/News/NewsList';
import NewsForm from './pages/News/NewsForm';
import EventList from './pages/Event/EventList';
import EventForm from './pages/Event/EventForm';
import CareerList from './pages/Career/CareerList';
import CareerForm from './pages/Career/CareerForm';
import ContactList from './pages/Contact/ContactList';
import BackupPage from './pages/Backup/BackupPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />

          <Route path="/dashboard/company" element={<ProtectedRoute requiredRoles={['super_admin', 'admin']}><DashboardLayout><CompanyInfo /></DashboardLayout></ProtectedRoute>} />

          {/* Heroes */}
          <Route path="/dashboard/heroes" element={<ProtectedRoute><DashboardLayout><HeroList /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/heroes/new" element={<ProtectedRoute><DashboardLayout><HeroForm /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/heroes/:id/edit" element={<ProtectedRoute><DashboardLayout><HeroForm /></DashboardLayout></ProtectedRoute>} />

          {/* Services */}
          <Route path="/dashboard/services" element={<ProtectedRoute><DashboardLayout><ServiceList /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/services/new" element={<ProtectedRoute><DashboardLayout><ServiceForm /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/services/:id/edit" element={<ProtectedRoute><DashboardLayout><ServiceForm /></DashboardLayout></ProtectedRoute>} />

          {/* Values */}
          <Route path="/dashboard/values" element={<ProtectedRoute><DashboardLayout><ValueList /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/values/new" element={<ProtectedRoute><DashboardLayout><ValueForm /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/values/:id/edit" element={<ProtectedRoute><DashboardLayout><ValueForm /></DashboardLayout></ProtectedRoute>} />

          {/* Products */}
          <Route path="/dashboard/products" element={<ProtectedRoute><DashboardLayout><ProductList /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/products/new" element={<ProtectedRoute><DashboardLayout><ProductForm /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/products/:id/edit" element={<ProtectedRoute><DashboardLayout><ProductForm /></DashboardLayout></ProtectedRoute>} />

          {/* Partners */}
          <Route path="/dashboard/partners" element={<ProtectedRoute><DashboardLayout><PartnerList /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/partners/new" element={<ProtectedRoute><DashboardLayout><PartnerForm /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/partners/bulk" element={<ProtectedRoute><DashboardLayout><PartnerBulkAdd /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/partners/:id/edit" element={<ProtectedRoute><DashboardLayout><PartnerForm /></DashboardLayout></ProtectedRoute>} />

          {/* Clients */}
          <Route path="/dashboard/clients" element={<ProtectedRoute><DashboardLayout><ClientList /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/clients/new" element={<ProtectedRoute><DashboardLayout><ClientForm /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/clients/bulk" element={<ProtectedRoute><DashboardLayout><ClientBulkAdd /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/clients/:id/edit" element={<ProtectedRoute><DashboardLayout><ClientForm /></DashboardLayout></ProtectedRoute>} />

          {/* News */}
          <Route path="/dashboard/news" element={<ProtectedRoute><DashboardLayout><NewsList /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/news/new" element={<ProtectedRoute><DashboardLayout><NewsForm /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/news/:id/edit" element={<ProtectedRoute><DashboardLayout><NewsForm /></DashboardLayout></ProtectedRoute>} />

          {/* Events */}
          <Route path="/dashboard/events" element={<ProtectedRoute><DashboardLayout><EventList /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/events/new" element={<ProtectedRoute><DashboardLayout><EventForm /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/events/:id/edit" element={<ProtectedRoute><DashboardLayout><EventForm /></DashboardLayout></ProtectedRoute>} />

          {/* Careers */}
          <Route path="/dashboard/careers" element={<ProtectedRoute><DashboardLayout><CareerList /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/careers/new" element={<ProtectedRoute><DashboardLayout><CareerForm /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/careers/:id/edit" element={<ProtectedRoute><DashboardLayout><CareerForm /></DashboardLayout></ProtectedRoute>} />

          {/* Contacts */}
          <Route path="/dashboard/contacts" element={<ProtectedRoute><DashboardLayout><ContactList /></DashboardLayout></ProtectedRoute>} />

          {/* Backup */}
          <Route path="/dashboard/backup" element={<ProtectedRoute requiredRoles={['super_admin', 'admin']}><DashboardLayout><BackupPage /></DashboardLayout></ProtectedRoute>} />

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;