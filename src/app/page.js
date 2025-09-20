'use client'
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, TrendingUp, Users, Plus, Edit, Trash2, Search, DollarSign, Calendar, BarChart3, Printer, Download, FileText, AlertCircle, Eye, EyeOff, Lock, User, X, Settings, LogOut, Shield, UserCheck } from 'lucide-react';
import UserManagement from '../components/UserManagement';
import SettingsComponent from '../components/Settings';
import { formatCurrency, formatDate, downloadReceiptPDF, printReceiptPDF } from '../lib/printUtils';
import { USER_ROLES, hasPermission, PERMISSIONS, DEFAULT_USERS, COMPANY_INFO, UI_THEME } from '../lib/constants';
import LababilLogo from '../components/LababilLogo';

// Initial data untuk demo
const initialProducts = [
  { id: '1', name: 'Website Development', category: 'Digital Service', price: 5000000, stock: 5 },
  { id: '2', name: 'Mobile App Development', category: 'Digital Service', price: 8000000, stock: 3 },
  { id: '3', name: 'Digital Marketing', category: 'Marketing', price: 2000000, stock: 10 },
  { id: '4', name: 'SEO Optimization', category: 'Marketing', price: 1500000, stock: 8 }
];

const initialSales = [
  {
    id: '1',
    productId: '1',
    productName: 'Website Development',
    customer: 'PT. Teknologi Maju',
    customerEmail: 'info@tekmaju.com',
    customerPhone: '+62 21-1234-5678',
    quantity: 1,
    total: 5000000,
    date: '2024-01-15',
    status: 'Completed',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: '2',
    productId: '2',
    productName: 'Mobile App Development',
    customer: 'CV. Digital Solusi',
    customerEmail: 'contact@digitalsolusi.co.id',
    customerPhone: '+62 812-3456-7890',
    quantity: 1,
    total: 8000000,
    date: '2024-01-14',
    status: 'Completed',
    paymentMethod: 'Bank Transfer'
  }
];

// Receipt Modal Component
const ReceiptModal = ({ isOpen, onClose, sale, companyInfo = COMPANY_INFO }) => {
  if (!isOpen || !sale) return null;

  const handlePrintPDF = () => printReceiptPDF(sale, companyInfo);
  const handleDownloadPDF = () => downloadReceiptPDF(sale, companyInfo);
  const totalWithTax = sale.total * 1.11;
  const tax = sale.total * 0.11;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto border border-white/30">
        <div className="flex justify-between items-center p-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Receipt Preview
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8 pb-8 border-b-2 border-gradient-to-r from-blue-600 to-purple-600">
            <div className="w-24 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              {/* ✅ UPDATED: Using SVG Logo Component */}
              <LababilLogo size={48} variant="white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {companyInfo.companyName}
            </h1>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{companyInfo.address}</p>
              <p>Telp: {companyInfo.phone} | Email: {companyInfo.email}</p>
              <p>Website: {companyInfo.website}</p>
            </div>
            <h2 className="text-2xl font-bold mt-6 text-gray-900">RECEIPT / KWITANSI</h2>
            <p className="text-lg text-gray-700 font-semibold">No. Receipt: #{sale.id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <div>
              <h3 className="font-bold mb-4 text-gray-900 text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Customer Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <span className="w-24 font-semibold text-gray-700">Name:</span>
                  <span className="text-gray-900 font-medium">{sale.customer}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 font-semibold text-gray-700">Email:</span>
                  <span className="text-gray-900 font-medium">{sale.customerEmail || '-'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 font-semibold text-gray-700">Phone:</span>
                  <span className="text-gray-900 font-medium">{sale.customerPhone || '-'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-gray-900 text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                Transaction Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <span className="w-24 font-semibold text-gray-700">Date:</span>
                  <span className="text-gray-900 font-medium">{formatDate(sale.date)}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 font-semibold text-gray-700">Status:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                    {sale.status || 'Completed'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 font-semibold text-gray-700">Payment:</span>
                  <span className="text-gray-900 font-medium">{sale.paymentMethod || 'Bank Transfer'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">No</th>
                  <th className="px-6 py-4 text-left font-bold">Description</th>
                  <th className="px-6 py-4 text-center font-bold">Qty</th>
                  <th className="px-6 py-4 text-right font-bold">Unit Price</th>
                  <th className="px-6 py-4 text-right font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-white hover:bg-gray-50">
                  <td className="px-6 py-4 text-center font-medium">1</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{sale.productName}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">
                      {sale.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">{formatCurrency(sale.total / sale.quantity)}</td>
                  <td className="px-6 py-4 text-right font-bold text-lg">{formatCurrency(sale.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 p-8 rounded-2xl border-2 border-gradient-to-r from-blue-200 to-purple-200">
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Subtotal:</span>
                <span className="font-bold">{formatCurrency(sale.total)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Tax (11%):</span>
                <span className="font-bold">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t-2 border-gradient-to-r from-blue-600 to-purple-600 pt-4 mt-4">
                <div className="flex justify-between text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  <span>TOTAL PAYMENT:</span>
                  <span>{formatCurrency(totalWithTax)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
            <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Thank You for Your Trust!
            </p>
            <p className="text-gray-700">
              For further questions about this service, please contact us.<br />
              All services are protected by warranty according to applicable terms.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-8 border-t bg-gradient-to-r from-gray-50 to-blue-50">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-3 text-green-700 bg-green-100 border border-green-300 rounded-xl hover:bg-green-200 flex items-center font-semibold transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Download PDF
          </button>
          <button
            onClick={handlePrintPDF}
            className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-600 rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center font-semibold shadow-lg transition-all duration-200"
          >
            <Printer className="h-5 w-5 mr-2" />
            Print PDF Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

// Authentication Components
const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      return;
    }
    setLoading(true);
    setError('');

    // Get users from localStorage or use defaults
    const savedUsers = localStorage.getItem('lababil_users');
    const users = savedUsers ? JSON.parse(savedUsers) : DEFAULT_USERS;

    const user = users.find(u => u.username === formData.username && u.isActive);

    if (!user || user.password !== formData.password) {
      setError('Invalid username or password, or account is inactive');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      onLogin({
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email
      });
      setLoading(false);
    }, 1000);
  };



   return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 px-8 py-10 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-blue-700/90"></div>
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl border border-white/30 shadow-lg">
                  {/* ✅ UPDATED: Using SVG Logo Component */}
                  <LababilLogo size={48} variant="white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Lababil Solution</h1>
              <p className="text-blue-100 text-sm font-medium">Digital Sales System v2.0</p>
            </div>
          </div>

          <div className="px-8 py-8 backdrop-blur-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">Welcome Back</h2>
              <p className="text-gray-600">Please sign in to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50/80 backdrop-blur border border-red-200 rounded-xl flex items-center animate-fade-in">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-hover:text-blue-500">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 shadow-sm"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-hover:text-blue-500">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-12 pr-14 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 shadow-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-4 px-4 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>



        <div className="text-center mt-8 text-sm text-gray-600 backdrop-blur">
          <p className="font-medium">&copy; 2024 Lababil Solution. All rights reserved.</p>
          <p className="mt-1 text-xs opacity-75">Enhanced Sales Management System</p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function LababilSalesApp() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(initialProducts);
  const [sales, setSales] = useState(initialSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  // Authentication
  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Dashboard calculations
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProducts = products.length;
  const totalSales = sales.length;
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (modalType === 'product') {
        if (editingItem) {
          const updatedProduct = {
            ...editingItem,
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock)
          };
          setProducts(products.map(p => p.id === editingItem.id ? updatedProduct : p));
        } else {
          const newProduct = {
            id: Date.now().toString(),
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock)
          };
          setProducts([...products, newProduct]);
        }
      } else if (modalType === 'sale') {
        const product = products.find(p => p.id === formData.productId);
        if (!product) {
          throw new Error('Product not found');
        }

        const newSale = {
          id: Date.now().toString(),
          productId: product.id,
          productName: product.name,
          quantity: parseInt(formData.quantity),
          total: product.price * parseInt(formData.quantity),
          date: new Date().toISOString().split('T')[0],
          customer: formData.customer,
          customerEmail: formData.customerEmail || '',
          customerPhone: formData.customerPhone || '',
          status: 'Completed',
          paymentMethod: 'Bank Transfer'
        };

        setSales([newSale, ...sales]);

        const updatedProduct = {
          ...product,
          stock: product.stock - parseInt(formData.quantity)
        };
        setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
      }

      setShowModal(false);
      setFormData({});
      setEditingItem(null);

    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to save data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

   // Handle delete with role-based access
  const handleDelete = async (type, id) => {
    // Check permissions
    if (type === 'product' && !hasPermission(user.role, PERMISSIONS.DELETE_PRODUCT)) {
      alert('Access denied: You do not have permission to delete products');
      return;
    }

    if (type === 'sale' && !hasPermission(user.role, PERMISSIONS.DELETE_SALE)) {
      alert('Access denied: Only administrators can delete sales records');
      return;
    }

    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setLoading(true);

      if (type === 'product') {
        setProducts(products.filter(p => p.id !== id));
      } else if (type === 'sale') {
        setSales(sales.filter(s => s.id !== id));
      }

    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

   // Handle print receipt (Quick print PDF)
  const handlePrintReceipt = (sale) => {
    if (hasPermission(user.role, PERMISSIONS.PRINT_RECEIPT)) {
      printReceiptPDF(sale, COMPANY_INFO);
    } else {
      alert('Access denied: You do not have permission to print receipts');
    }
  };

  // Handle print with preview
  const handlePrintWithPreview = (sale) => {
    if (hasPermission(user.role, PERMISSIONS.PRINT_RECEIPT)) {
      setSelectedSale(sale);
      setShowReceiptModal(true);
    } else {
      alert('Access denied: You do not have permission to print receipts');
    }
  };

  // Handle download receipt PDF
  const handleDownloadReceipt = (sale) => {
    if (hasPermission(user.role, PERMISSIONS.DOWNLOAD_RECEIPT)) {
      downloadReceiptPDF(sale, COMPANY_INFO);
    } else {
      alert('Access denied: You do not have permission to download receipts');
    }
  };

  // Open modal
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  // Filtered data
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSales = sales.filter(sale =>
    sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-4 mt-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">✕</button>
          </div>
        </div>
      )}

       {/* Header */}
      <header className="bg-gradient-to-r from-white via-blue-50 to-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white p-3 rounded-2xl mr-4 shadow-lg">
                {/* ✅ UPDATED: Using SVG Logo Component */}
                <LababilLogo size={28} variant="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Lababil Solution
                </h1>
                <p className="text-sm text-gray-600 font-medium">Digital Sales System v2.0</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {loading && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Processing...</span>
                </div>
              )}
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">Welcome, {user.name}</div>
                <div className="flex items-center text-sm text-gray-600">
                  {user.role === USER_ROLES.ADMIN ? (
                    <>
                      <Shield className="h-4 w-4 mr-1 text-purple-600" />
                      <span className="font-semibold text-purple-600">Administrator</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 mr-1 text-blue-600" />
                      <span className="font-semibold text-blue-600">Cashier</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-1 mb-8 shadow-inner">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3, permission: null },
            { id: 'products', label: 'Products', icon: Package, permission: PERMISSIONS.READ_PRODUCT },
            { id: 'sales', label: 'Sales', icon: TrendingUp, permission: PERMISSIONS.READ_SALE },
            ...(hasPermission(user.role, PERMISSIONS.ACCESS_SETTINGS)
              ? [{ id: 'settings', label: 'Settings', icon: Settings, permission: PERMISSIONS.ACCESS_SETTINGS }]
              : []
            )
          ].filter(tab => !tab.permission || hasPermission(user.role, tab.permission)).map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <TabIcon className="h-5 w-5 mr-2" />
                {tab.label}
                {tab.id === 'settings' && (
                  <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-bold">
                    ADMIN
                  </span>
                )}
              </button>
            );
          })}
        </div>

         {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <DollarSign className="h-8 w-8" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Total Products</p>
                    <p className="text-2xl font-bold">{totalProducts}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Package className="h-8 w-8" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium mb-1">Total Sales</p>
                    <p className="text-2xl font-bold">{totalSales}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium mb-1">Avg Order Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Users className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-blue-600" />
                  Recent Sales Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {sales.slice(0, 5).map((sale, index) => (
                    <div key={sale.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{sale.productName}</p>
                          <p className="text-sm text-gray-600 font-medium">{sale.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(sale.total)}</p>
                          <p className="text-sm text-gray-600">{formatDate(sale.date)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePrintWithPreview(sale)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Print with Preview"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadReceipt(sale)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && hasPermission(user.role, PERMISSIONS.READ_PRODUCT) && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
              {hasPermission(user.role, PERMISSIONS.CREATE_PRODUCT) && (
                <button
                  onClick={() => openModal('product')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center font-semibold shadow-lg transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Product
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">All Products</h3>
                  <div className="relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">Product Name</th>
                      <th className="px-6 py-4 text-left font-bold">Category</th>
                      <th className="px-6 py-4 text-right font-bold">Price</th>
                      <th className="px-6 py-4 text-center font-bold">Stock</th>
                      <th className="px-6 py-4 text-center font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <tr key={product.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 font-semibold text-gray-900">{product.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(product.price)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            product.stock > 10 ? 'bg-green-100 text-green-800' :
                            product.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            {hasPermission(user.role, PERMISSIONS.UPDATE_PRODUCT) && (
                              <button
                                onClick={() => openModal('product', product)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            )}
                            {hasPermission(user.role, PERMISSIONS.DELETE_PRODUCT) && (
                              <button
                                onClick={() => handleDelete('product', product.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && hasPermission(user.role, PERMISSIONS.READ_SALE) && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Sales Management</h2>
              {hasPermission(user.role, PERMISSIONS.CREATE_SALE) && (
                <button
                  onClick={() => openModal('sale')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center font-semibold shadow-lg transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Sale
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">All Sales</h3>
                  <div className="relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search sales..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">Product</th>
                      <th className="px-6 py-4 text-left font-bold">Customer</th>
                      <th className="px-6 py-4 text-right font-bold">Quantity</th>
                      <th className="px-6 py-4 text-right font-bold">Total</th>
                      <th className="px-6 py-4 text-center font-bold">Date</th>
                      <th className="px-6 py-4 text-center font-bold">Status</th>
                      <th className="px-6 py-4 text-center font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((sale, index) => (
                      <tr key={sale.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 font-semibold text-gray-900">{sale.productName}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{sale.customer}</p>
                            <p className="text-sm text-gray-600">{sale.customerEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">{sale.quantity}</td>
                        <td className="px-6 py-4 text-right font-bold text-lg text-gray-900">{formatCurrency(sale.total)}</td>
                        <td className="px-6 py-4 text-center text-gray-600">{formatDate(sale.date)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                            {sale.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handlePrintWithPreview(sale)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Print with Preview"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadReceipt(sale)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            {hasPermission(user.role, PERMISSIONS.DELETE_SALE) && (
                              <button
                                onClick={() => handleDelete('sale', sale.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete Sale"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && hasPermission(user.role, PERMISSIONS.ACCESS_SETTINGS) && (
          <SettingsComponent />
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/30">
              <div className="flex justify-between items-center p-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {modalType === 'product' ? (editingItem ? 'Edit Product' : 'Add New Product') : (editingItem ? 'Edit Sale' : 'Add New Sale')}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-8">
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                  {modalType === 'product' ? (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Product Name</label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter product name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                        <select
                          value={formData.category || ''}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                        >
                          <option value="">Select category</option>
                          <option value="Digital Service">Digital Service</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Price</label>
                          <input
                            type="number"
                            value={formData.price || ''}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="0"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Stock</label>
                          <input
                            type="number"
                            value={formData.stock || ''}
                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="0"
                            min="0"
                            required
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Product</label>
                        <select
                          value={formData.productId || ''}
                          onChange={(e) => setFormData({...formData, productId: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                        >
                          <option value="">Select product</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name} - {formatCurrency(product.price)} (Stock: {product.stock})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                        <input
                          type="number"
                          value={formData.quantity || ''}
                          onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="1"
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Customer Name</label>
                        <input
                          type="text"
                          value={formData.customer || ''}
                          onChange={(e) => setFormData({...formData, customer: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter customer name"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Customer Email</label>
                          <input
                            type="email"
                            value={formData.customerEmail || ''}
                            onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="customer@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Customer Phone</label>
                          <input
                            type="tel"
                            value={formData.customerPhone || ''}
                            onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="+62 xxx-xxxx-xxxx"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-600 rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (editingItem ? 'Update' : 'Save')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        <ReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          sale={selectedSale}
        />
      </div>
    </div>
  );
}
