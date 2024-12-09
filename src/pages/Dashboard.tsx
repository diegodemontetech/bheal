import React, { Suspense } from 'react';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Lazy load NewsSection
const NewsSection = React.lazy(() => import('../components/NewsSection'));

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const metrics = [
  {
    id: 1,
    name: 'Total de Leads',
    value: '245',
    change: '+12.5%',
    changeType: 'increase',
    icon: Users
  },
  {
    id: 2,
    name: 'Taxa de Conversão',
    value: '24.3%',
    change: '+4.1%',
    changeType: 'increase',
    icon: TrendingUp
  },
  {
    id: 3,
    name: 'Valor Médio',
    value: 'R$ 12.500',
    change: '+2.3%',
    changeType: 'increase',
    icon: DollarSign
  },
  {
    id: 4,
    name: 'Oportunidades Ativas',
    value: '85',
    change: '-3.2%',
    changeType: 'decrease',
    icon: Target
  }
];

const salesData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Vendas 2024',
      data: [65, 59, 80, 81, 56, 55],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }
  ]
};

const pipelineData = {
  labels: ['Hunting', 'Carteira', 'Positivação'],
  datasets: [
    {
      data: [300, 200, 100],
      backgroundColor: [
        'rgb(54, 162, 235)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)'
      ]
    }
  ]
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* News Section with Loading */}
        <div className="w-full">
          <Suspense fallback={
            <div className="w-full h-96 bg-white rounded-lg shadow-sm animate-pulse">
              <div className="h-64 bg-gray-200 rounded-t-lg"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          }>
            <NewsSection />
          </Suspense>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100">
                  <metric.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 font-poppins">{metric.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 font-poppins">{metric.value}</p>
                    <p className={`ml-2 text-sm font-medium ${
                      metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    } font-poppins`}>
                      {metric.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 font-poppins">Vendas por Período</h2>
            <Line data={salesData} />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 font-poppins">Distribuição por Pipeline</h2>
            <div className="h-64">
              <Doughnut data={pipelineData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}