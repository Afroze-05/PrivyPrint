import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../components/UI';

const logs = [
  { id: 'SPX-9921', type: 'Color', copies: 3, time: '12:44 PM', status: 'Completed' },
  { id: 'SPX-4412', type: 'B/W',   copies: 1, time: '01:15 PM', status: 'Flagged'   },
  { id: 'SPX-0019', type: 'B/W',   copies: 10, time: '02:30 PM', status: 'Completed' },
  { id: 'SPX-7731', type: 'Color', copies: 2, time: '03:05 PM', status: 'Completed' },
  { id: 'SPX-5509', type: 'B/W',   copies: 5, time: '04:20 PM', status: 'Flagged'   },
];

export default function PrintLogs() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #F5F5DC 0%, #EEF5FF 100%)' }}
    >
      {/* Nav */}
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
            📋
          </div>
          <span className="font-black text-[#0A192F] text-lg">Print Logs</span>
        </div>
        <Button variant="ghost" className="text-sm py-2 px-3" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </Button>
      </div>

      <div className="p-8 max-w-4xl mx-auto animate-fade-in-up">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Sessions', value: logs.length, icon: '🖨️' },
            { label: 'Completed', value: logs.filter((l) => l.status === 'Completed').length, icon: '✅' },
            { label: 'Flagged', value: logs.filter((l) => l.status === 'Flagged').length, icon: '⚠️' },
          ].map((s) => (
            <Card key={s.label} className="p-5 flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'rgba(21,101,192,0.1)' }}
              >
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-[#0A192F]">{s.value}</p>
                <p className="text-xs text-gray-400 font-semibold">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-base font-black text-[#0A192F]">Recent Print Activity</h2>
            <Badge variant="default">Today</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Token ID', 'Type', 'Copies', 'Time', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-xs font-black text-gray-400 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-50 transition-colors duration-150"
                    style={{ ':hover': { background: '#F9FAFB' } }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = '#F5F9FF')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'transparent')
                    }
                  >
                    <td className="px-6 py-4">
                      <span className="font-black text-[#0A192F] text-sm font-mono">
                        {log.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{
                          background:
                            log.type === 'Color'
                              ? 'rgba(21,101,192,0.1)'
                              : '#F3F4F6',
                          color: log.type === 'Color' ? '#1565C0' : '#6B7280',
                        }}
                      >
                        {log.type === 'Color' ? '🎨' : '⬛'} {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                      ×{log.copies}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                      {log.time}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={log.status === 'Flagged' ? 'danger' : 'success'}>
                        {log.status === 'Flagged' ? '⚠️ Flagged' : '✓ Completed'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 border-t border-gray-50 text-xs text-gray-400 font-medium">
            Showing {logs.length} sessions · Last updated just now
          </div>
        </Card>
      </div>
    </div>
  );
}