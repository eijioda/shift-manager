import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

// Firebaseの設定
const firebaseConfig = {
  // 既存の設定をそのまま残す
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function App() {
  // 定数の定義
  const dates = ['1/6', '1/11', '1/12', '1/20', '1/25'];
  const times = {
    morning: '7:00-11:00',
    afternoon: '14:00-16:30'
  };

  // State管理
  const [mode, setMode] = useState('preferences'); // 画面モード（preferences/schedule）
  const [staffList, setStaffList] = useState([]); // スタッフリスト
  const [preferences, setPreferences] = useState({}); // 希望シフト
  const [shifts, setShifts] = useState({}); // 確定シフト
  const [newStaffName, setNewStaffName] = useState(''); // 新規スタッフ名

  // データベースからの読み込み
  useEffect(() => {
    const loadData = () => {
      // スタッフリストの読み込み
      onValue(ref(db, 'staffList'), (snapshot) => {
        const data = snapshot.val();
        if (data) setStaffList(data);
      });

      // 希望シフトの読み込み
      onValue(ref(db, 'preferences'), (snapshot) => {
        const data = snapshot.val();
        if (data) setPreferences(data);
      });

      // 確定シフトの読み込み
      onValue(ref(db, 'shifts'), (snapshot) => {
        const data = snapshot.val();
        if (data) setShifts(data);
      });
    };

    loadData();
  }, []);

  // スタッフの追加処理
  const handleAddStaff = () => {
    if (newStaffName && !staffList.includes(newStaffName)) {
      const newList = [...staffList, newStaffName];
      setStaffList(newList);
      set(ref(db, 'staffList'), newList);
      setNewStaffName('');
    }
  };

  // 希望シフトの更新処理
  const handlePreferenceChange = (staff, date, time, canWork) => {
    const newPreferences = {
      ...preferences,
      [staff]: {
        ...(preferences[staff] || {}),
        [date]: {
          ...(preferences[staff]?.[date] || {}),
          [time]: canWork
        }
      }
    };
    setPreferences(newPreferences);
    set(ref(db, 'preferences'), newPreferences);
  };

  // シフトの自動生成
  const generateShifts = () => {
    const newShifts = {};
    dates.forEach(date => {
      newShifts[date] = {
        morning: '',
        afternoon: ''
      };

      // 各時間帯で働けるスタッフを抽出
      const availableStaff = {
        morning: staffList.filter(staff => preferences[staff]?.[date]?.morning),
        afternoon: staffList.filter(staff => preferences[staff]?.[date]?.afternoon)
      };

      // ランダムに割り当て
      if (availableStaff.morning.length > 0) {
        newShifts[date].morning = availableStaff.morning[
          Math.floor(Math.random() * availableStaff.morning.length)
        ];
      }
      
      if (availableStaff.afternoon.length > 0) {
        newShifts[date].afternoon = availableStaff.afternoon[
          Math.floor(Math.random() * availableStaff.afternoon.length)
        ];
      }
    });

    setShifts(newShifts);
    set(ref(db, 'shifts'), newShifts);
    setMode('schedule');
  };

  // 画面の描画
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      backgroundColor: 'white',  // 背景色を白に
      color: 'black',           // 文字色を黒に
      minHeight: '100vh'        // 最小の高さを画面いっぱいに
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: 'black'          // タイトルの文字色を黒に
      }}>シフト管理</h1>

      {/* モード切り替えボタン */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => setMode('preferences')}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: mode === 'preferences' ? '#4CAF50' : '#e0e0e0',
            color: mode === 'preferences' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          希望入力
        </button>
        <button 
          onClick={() => setMode('schedule')}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: mode === 'schedule' ? '#4CAF50' : '#e0e0e0',
            color: mode === 'schedule' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          シフト確認
        </button>
      </div>

      {/* 以下、既存のコードはそのまま */}

      {/* 希望入力画面 */}
      {mode === 'preferences' && (
        <div>
          {/* スタッフ追加フォーム */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              placeholder="新しいスタッフ名"
            />
            <button onClick={handleAddStaff}>追加</button>
          </div>

          {/* 希望シフト入力フォーム */}
          {staffList.map(staff => (
            <div key={staff} style={{ marginBottom: '20px' }}>
              <h3>{staff}</h3>
              {dates.map(date => (
                <div key={date}>
                  <p>{date}</p>
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences[staff]?.[date]?.morning || false}
                      onChange={(e) => handlePreferenceChange(staff, date, 'morning', e.target.checked)}
                    />
                    午前 ({times.morning})
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences[staff]?.[date]?.afternoon || false}
                      onChange={(e) => handlePreferenceChange(staff, date, 'afternoon', e.target.checked)}
                    />
                    午後 ({times.afternoon})
                  </label>
                </div>
              ))}
            </div>
          ))}

          {/* シフト生成ボタン */}
          {staffList.length > 0 && (
            <button onClick={generateShifts}>
              シフトを自動生成
            </button>
          )}
        </div>
      )}

      {/* シフト確認画面 */}
      {mode === 'schedule' && (
        <div>
          {dates.map(date => (
            <div key={date}>
              <h3>{date}</h3>
              <p>午前 ({times.morning}): {shifts[date]?.morning || '未割当'}</p>
              <p>午後 ({times.afternoon}): {shifts[date]?.afternoon || '未割当'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;