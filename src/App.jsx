import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaXCLsoa_qeCZv8WILiXaxqw_tREP0_qM",
  authDomain: "shift-manager-44ee7.firebaseapp.com",
  databaseURL: "https://shift-manager-44ee7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shift-manager-44ee7",
  storageBucket: "shift-manager-44ee7.firebasestorage.app",
  messagingSenderId: "526799917543",
  appId: "1:526799917543:web:af30f949cb34b2ba932d42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaXCLsoa_qeCZv8WILiXaxqw_tREP0_qM",
  authDomain: "shift-manager-44ee7.firebaseapp.com",
  databaseURL: "https://shift-manager-44ee7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shift-manager-44ee7",
  storageBucket: "shift-manager-44ee7.firebasestorage.app",
  messagingSenderId: "526799917543",
  appId: "1:526799917543:web:af30f949cb34b2ba932d42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ここに先ほどコピーしたfirebaseConfigを貼り付け
const firebaseConfig = {// Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAaXCLsoa_qeCZv8WILiXaxqw_tREP0_qM",
    authDomain: "shift-manager-44ee7.firebaseapp.com",
    databaseURL: "https://shift-manager-44ee7-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "shift-manager-44ee7",
    storageBucket: "shift-manager-44ee7.firebasestorage.app",
    messagingSenderId: "526799917543",
    appId: "1:526799917543:web:af30f949cb34b2ba932d42"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Firebase Consoleからコピーした設定をここに貼り付け
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

// Firebase設定は変更なし
const firebaseConfig = {
  // 既存の設定をそのまま使用
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function App() {
  const dates = ['1/6', '1/11', '1/12', '1/20', '1/25'];
  const times = {
    morning: '7:00-11:00',
    afternoon: '14:00-16:30'
  };

  const [mode, setMode] = useState('preferences'); // 'preferences' or 'schedule'
  const [staffList, setStaffList] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [shifts, setShifts] = useState({});
  const [newStaffName, setNewStaffName] = useState('');

  // データをロード
  useEffect(() => {
    const staffRef = ref(db, 'staffList');
    const preferencesRef = ref(db, 'preferences');
    const shiftsRef = ref(db, 'shifts');

    onValue(staffRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setStaffList(data);
    });

    onValue(preferencesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setPreferences(data);
    });

    onValue(shiftsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setShifts(data);
    });
  }, []);

  // スタッフ追加
  const handleAddStaff = () => {
    if (newStaffName && !staffList.includes(newStaffName)) {
      const newList = [...staffList, newStaffName];
      setStaffList(newList);
      set(ref(db, 'staffList'), newList);
      setNewStaffName('');
    }
  };

  // 希望シフト更新
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

  // シフト自動生成
  const generateShifts = () => {
    const newShifts = {};
    
    dates.forEach(date => {
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
        morning: availableStaff.morning[Math.floor(Math.random() * availableStaff.morning.length)] || '未割当',
        afternoon: availableStaff.afternoon[Math.floor(Math.random() * availableStaff.afternoon.length)] || '未割当'
      };
    });

    setShifts(newShifts);
    set(ref(db, 'shifts'), newShifts);
    setMode('schedule');
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>シフト管理</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setMode('preferences')}
          style={{
            padding: '8px 16px',
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
            padding: '8px 16px',
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

      {mode === 'preferences' && (
        <>
          {/* スタッフ追加セクション */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              placeholder="新しいスタッフ名"
              style={{
                padding: '8px',
                marginRight: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <button
              onClick={handleAddStaff}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              スタッフを追加
            </button>
          </div>

          {/* 希望シフト入力セクション */}
          {staffList.map(staff => (
            <div key={staff} style={{
              marginBottom: '20px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}>
              <h3 style={{ marginBottom: '10px' }}>{staff}</h3>
              {dates.map(date => (
                <div key={date} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{date}</div>
                  <label style={{ marginRight: '15px' }}>
                    <input
                      type="checkbox"
                      checked={preferences[staff]?.[date]?.morning || false}
                      onChange={(e) => handlePreferenceChange(staff, date, 'morning', e.target.checked)}
                    /> 午前 ({times.morning})
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences[staff]?.[date]?.afternoon || false}
                      onChange={(e) => handlePreferenceChange(staff, date, 'afternoon', e.target.checked)}
                    /> 午後 ({times.afternoon})
                  </label>
                </div>
              ))}
            </div>
          ))}

          {staffList.length > 0 && (
            <button
              onClick={generateShifts}
              style={{
                padding: '12px 24px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'block',
                margin: '20px auto'
              }}
            >
              シフトを自動生成
            </button>
          )}
        </>
      )}

      {mode === 'schedule' && (
        <div>
          {dates.map(date => (
            <div key={date} style={{
              marginBottom: '15px',
              padding: '15px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '10px' }}>{date}</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <div style={{ color: '#666', marginBottom: '5px' }}>午前 ({times.morning})</div>
                  <div style={{ fontWeight: 'bold' }}>{shifts[date]?.morning || '未割当'}</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <div style={{ color: '#666', marginBottom: '5px' }}>午後 ({times.afternoon})</div>
                  <div style={{ fontWeight: 'bold' }}>{shifts[date]?.afternoon || '未割当'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;