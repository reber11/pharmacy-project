import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { sales, medicines } from '../data/mockData';
import ExportReportModal from './ExportReportModal';

export default function Reports() {
  const [dateRange, setDateRange] = useState('week');
  const [reportType, setReportType] = useState('sales');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const salesData = {
    daily: sales.reduce((acc, sale) => acc + sale.totalAmount, 0) / 7,
    weekly: sales.reduce((acc, sale) => acc + sale.totalAmount, 0),
    monthly: sales.reduce((acc, sale) => acc + sale.totalAmount, 0) * 4,
  };

  const inventoryStats = {
    totalItems: medicines.length,
    lowStock: medicines.filter(med => med.stock < 100).length,
    expiringSoon: medicines.filter(med => new Date(med.expiryDate) < new Date('2024-12-31')).length,
  };

  const topSellingMedicines = medicines
    .slice(0, 5)
    .map(med => ({
      ...med,
      totalSales: sales.filter(sale => sale.medicineId === med.id)
        .reduce((acc, sale) => acc + sale.totalAmount, 0)
    }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-5 w-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-4 border-b">
        {['sales', 'inventory', 'financial'].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 font-medium ${
              reportType === type
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setReportType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Report
          </button>
        ))}
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Daily Average</p>
              <p className="text-2xl font-bold text-gray-800">
                ${salesData.daily.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Weekly Sales</p>
              <p className="text-2xl font-bold text-gray-800">
                ${salesData.weekly.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Projection</p>
              <p className="text-2xl font-bold text-gray-800">
                ${salesData.monthly.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Medicines */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Top Selling Medicines</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topSellingMedicines.map((medicine) => (
              <tr key={medicine.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{medicine.name}</div>
                  <div className="text-sm text-gray-500">{medicine.manufacturer}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{medicine.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    medicine.stock < 100 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {medicine.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-green-600 font-medium">${medicine.totalSales.toFixed(2)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Inventory Summary</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Items</span>
              <span className="font-semibold">{inventoryStats.totalItems}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Low Stock Items</span>
              <span className="text-red-600 font-semibold">{inventoryStats.lowStock}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expiring Soon</span>
              <span className="text-yellow-600 font-semibold">{inventoryStats.expiringSoon}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 col-span-2">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend</h4>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Sales trend chart will be displayed here
          </div>
        </div>
      </div>

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        dateRange={dateRange}
        reportType={reportType}
      />
    </div>
  );
}