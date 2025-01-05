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


function App() {
  const dates = ['1/6', '1/11', '1/12', '1/20', '1/25'];
  const times = {
    morning: '7:00-11:00',
    afternoon: '14:00-16:30'
  };

  const [shifts, setShifts] = useState({});

  // Firebaseからデータを読み込み
  useEffect(() => {
    const shiftsRef = ref(db, 'shifts');
    onValue(shiftsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setShifts(data);
      } else {
        // 初期データの設定
        const initialShifts = dates.reduce((acc, date) => ({
          ...acc,
          [date]: { staff: '' }
        }), {});
        setShifts(initialShifts);
        set(shiftsRef, initialShifts);
      }
    });
  }, []);

  // スタッフ名の変更処理
  const handleStaffChange = (date, name) => {
    const newShifts = {
      ...shifts,
      [date]: { staff: name }
    };
    setShifts(newShifts);
    // Firebaseにデータを保存
    set(ref(db, 'shifts'), newShifts);
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
            value={shifts[date]?.staff || ''}
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