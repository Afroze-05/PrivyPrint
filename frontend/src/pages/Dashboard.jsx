import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, StatCard, Button } from '../components/UI';

const pieData = [
  { name: 'B/W', value: 65 },
  { name: 'Color', value: 35 },
];
const barData = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 19 },
  { day: 'Wed', count: 15 },
  { day: 'Thu', count: 22 },
  { day: 'Fri', count: 30 },
  { day: 'Sat', count: 10 },
];
const PIE_COLORS = ['#0A192F', '#1565C0'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-xl px-4 py-2 text-sm font-bold text-[#0A192F] border border-gray-100">
        {label && <p className="text-gray-400 text-xs mb-0.5">{label}</p>}
        <p>{payload[0].name || 'Value'}: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #F5F5DC 0%, #EEF5FF 100%)' }}
    >
      {/* Top nav */}
      <div
        className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(21,101,192,0.1)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg,#1565C0,#0A192F)' }}
          >
            🔐
          </div>
          <span className="font-black text-[#0A192F] text-lg">PrivyPrint</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(21,101,192,0.1)', color: '#1565C0' }}
          >
            Admin
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-sm py-2 px-4" onClick={() => navigate('/print-panel')}>
            🖨️ Print Panel
          </Button>
          <Button variant="ghost" className="text-sm py-2 px-4" onClick={() => navigate('/logs')}>
            📋 Logs
          </Button>
          <Button variant="secondary" className="text-sm py-2 px-4" onClick={() => navigate('/')}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0A192F]">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back — here's today's overview.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard label="Total Customers" value="1,024" icon="👥" trend="↑ 12% this week" />
          <StatCard label="Total Prints" value="4,567" icon="🖨️" trend="↑ 8% this week" />
          <StatCard label="Color Ratio" value="35%" icon="🎨" />
          <StatCard label="Trust Score" value="99.2%" icon="🛡️" trend="Excellent" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-black text-[#0A192F] mb-1">Print Distribution</h3>
            <p className="text-xs text-gray-400 mb-4">B/W vs Color breakdown</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={10}
                    formatter={(v) => (
                      <span className="text-xs font-bold text-gray-600">{v}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-black text-[#0A192F] mb-1">Weekly Print Volume</h3>
            <p className="text-xs text-gray-400 mb-4">Number of prints per day</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barSize={28}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 700, fill: '#9CA3AF' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#D1D5DB' }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(21,101,192,0.05)', radius: 8 }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={i === 4 ? '#0A192F' : '#1565C0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}