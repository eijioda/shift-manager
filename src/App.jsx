import React, { useState } from 'react';

function App() {
  // 日付の設定
  const dates = ['1/6', '1/11', '1/12', '1/20', '1/25'];
  
  // シフト時間
  const times = {
    morning: '7:00-11:00',
    afternoon: '14:00-16:30'
  };

  // シフトのデータ管理
  const [shifts, setShifts] = useState(
    dates.reduce((acc, date) => ({
      ...acc,
      [date]: { staff: '' }
    }), {})
  );

  // スタッフ名の変更処理
  const handleStaffChange = (date, name) => {
    setShifts({
      ...shifts,
      [date]: { staff: name }
    });
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '24px', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        シフト管理表
      </h1>
      
      {dates.map((date) => (
        <div key={date} style={{ 
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '15px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            marginBottom: '10px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {date}
          </h2>
          
          <div style={{ 
            color: '#666',
            fontSize: '14px',
            marginBottom: '10px'
          }}>
            <p>午前：{times.morning}</p>
            <p>午後：{times.afternoon}</p>
          </div>

          <input
            type="text"
            value={shifts[date].staff}
            onChange={(e) => handleStaffChange(date, e.target.value)}
            placeholder="担当者名を入力"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
