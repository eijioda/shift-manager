import React, { useState, useEffect } from 'react';

function App() {
  // 月選択用
  const months = ['1月', '2月', '3月', '4月'];
  const [selectedMonth, setSelectedMonth] = useState('1月');
  
  // 日付データ（月ごと）
  const monthDates = {
    '1月': ['1/6', '1/11', '1/12', '1/20', '1/25'],
    '2月': ['2/3', '2/10', '2/15', '2/20', '2/25'],
    '3月': ['3/5', '3/10', '3/15', '3/20', '3/25'],
    '4月': ['4/2', '4/8', '4/15', '4/20', '4/25']
  };

  const times = {
    morning: '7:00-11:00',
    afternoon: '14:00-16:30'
  };

  // スタッフリスト
  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('staffList');
    return saved ? JSON.parse(saved) : [];
  });

  // シフトデータ
  const [shifts, setShifts] = useState(() => {
    const saved = localStorage.getItem('shifts');
    return saved ? JSON.parse(saved) : {};
  });

  // 希望シフトデータ
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('preferences');
    return saved ? JSON.parse(saved) : {};
  });

  // 表示モード（'schedule', 'preferences', 'staff'）
  const [viewMode, setViewMode] = useState('schedule');

  // データを保存
  useEffect(() => {
    localStorage.setItem('shifts', JSON.stringify(shifts));
    localStorage.setItem('staffList', JSON.stringify(staffList));
    localStorage.setItem('preferences', JSON.stringify(preferences));
  }, [shifts, staffList, preferences]);

  // 希望シフト入力の処理
  const handlePreferenceChange = (staff, date, time, canWork) => {
    setPreferences(prev => ({
      ...prev,
      [staff]: {
        ...prev[staff],
        [date]: {
          ...(prev[staff]?.[date] || {}),
          [time]: canWork
        }
      }
    }));
  };

  // 自動シフト生成
  const generateShifts = () => {
    const newShifts = {};
    Object.keys(monthDates).forEach(month => {
      monthDates[month].forEach(date => {
        const availableStaff = {
          morning: [],
          afternoon: []
        };

        // 各時間帯で働けるスタッフを集める
        staffList.forEach(staff => {
          if (preferences[staff]?.[date]?.morning) {
            availableStaff.morning.push(staff);
          }
          if (preferences[staff]?.[date]?.afternoon) {
            availableStaff.afternoon.push(staff);
          }
        });

        // ランダムに割り当て
        newShifts[date] = {
          morning: availableStaff.morning[Math.floor(Math.random() * availableStaff.morning.length)] || '',
          afternoon: availableStaff.afternoon[Math.floor(Math.random() * availableStaff.afternoon.length)] || ''
        };
      });
    });
    setShifts(newShifts);
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>シフト管理システム</h1>

      {/* モード切り替えボタン */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setViewMode('schedule')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'schedule' ? '#4CAF50' : '#f0f0f0',
            color: viewMode === 'schedule' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          シフト表示
        </button>
        <button
          onClick={() => setViewMode('preferences')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'preferences' ? '#4CAF50' : '#f0f0f0',
            color: viewMode === 'preferences' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          希望入力
        </button>
        <button
          onClick={() => setViewMode('staff')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'staff' ? '#4CAF50' : '#f0f0f0',
            color: viewMode === 'staff' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          スタッフ管理
        </button>
      </div>

      {/* 月選択 */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        {viewMode === 'schedule' && (
          <button
            onClick={generateShifts}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            シフト自動生成
          </button>
        )}
      </div>

      {viewMode === 'preferences' && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ marginBottom: '15px' }}>希望シフト入力</h2>
          {staffList.map(staff => (
            <div key={staff} style={{ 
              marginBottom: '20px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}>
              <h3 style={{ marginBottom: '10px' }}>{staff}</h3>
              {monthDates[selectedMonth].map(date => (
                <div key={date} style={{ marginBottom: '15px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{date}</div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={preferences[staff]?.[date]?.morning || false}
                        onChange={(e) => handlePreferenceChange(staff, date, 'morning', e.target.checked)}
                      />
                      午前 {times.morning}
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={preferences[staff]?.[date]?.afternoon || false}
                        onChange={(e) => handlePreferenceChange(staff, date, 'afternoon', e.target.checked)}
                      />
                      午後 {times.afternoon}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {viewMode === 'schedule' && (
        <div>
          {monthDates[selectedMonth].map(date => (
            <div key={date} style={{ 
              marginBottom: '15px',
              padding: '15px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '10px' }}>{date}</h3>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#666', marginBottom: '5px' }}>午前 {times.morning}</div>
                  <select
                    value={shifts[date]?.morning || ''}
                    onChange={(e) => setShifts({
                      ...shifts,
                      [date]: { ...shifts[date], morning: e.target.value }
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="">未割当</option>
                    {staffList.map(staff => (
                      <option key={staff} value={staff}>{staff}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#666', marginBottom: '5px' }}>午後 {times.afternoon}</div>
                  <select
                    value={shifts[date]?.afternoon || ''}
                    onChange={(e) => setShifts({
                      ...shifts,
                      [date]: { ...shifts[date], afternoon: e.target.value }
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="">未割当</option>
                    {staffList.map(staff => (
                      <option key={staff} value={staff}>{staff}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'staff' && (
        <div style={{ 
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ marginBottom: '15px' }}>スタッフ管理</h2>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="新しいスタッフ名"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  setStaffList([...staffList, e.target.value]);
                  e.target.value = '';
                }
              }}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                width: '100%'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {staffList.map(staff => (
              <div key={staff} style={{
                padding: '8px 12px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {staff}
                <button
                  onClick={() => setStaffList(staffList.filter(s => s !== staff))}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: '0 4px'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;