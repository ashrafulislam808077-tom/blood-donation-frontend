import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://blood-donation-backend-rscs.onrender.com';

function App() {
  const [activeTab, setActiveTab] = useState('request');
  const [selectedGroup, setSelectedGroup] = useState('B+');
  const [donors, setDonors] = useState([]);
  const [loadingDonors, setLoadingDonors] = useState(false);

  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regData, setRegData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: 'A+',
    address: '',
    password: '',
    securityQuestion: 'আপনার শৈশবের ডাকনাম কি?',
    securityAnswer: ''
  });
  const [profilePic, setProfilePic] = useState(null);

  const [requests, setRequests] = useState([]);
  const [requestData, setRequestData] = useState({
    patientName: '',
    problem: '',
    bloodGroup: 'A+',
    hemoglobin: '',
    amount: '',
    donationDate: '',
    donationPlace: '',
    contactPhone: '',
    reference: ''
  });

  useEffect(() => {
    if (activeTab === 'search') {
      fetchDonors();
    }
  }, [selectedGroup, activeTab]);

  const fetchDonors = async () => {
    setLoadingDonors(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/donors?group=${encodeURIComponent(selectedGroup)}`);
      setDonors(res.data || []);
    } catch (err) {
      console.error("Error fetching donors:", err);
    } finally {
      setLoadingDonors(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'all-requests') {
      fetchRequests();
    }
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/requests`);
      setRequests(res.data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(regData).forEach((key) => formData.append(key, regData[key]));
    if (profilePic) {
      formData.append('image', profilePic);
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(res.data.message || 'রেজিস্ট্রেশন সফল হয়েছে!');
      setActiveTab('login');
    } catch (err) {
      alert(err.response?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে!');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginPhone || !loginPassword) {
      alert('মোবাইল নম্বর এবং পাসওয়ার্ড দিন!');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, {
        phone: loginPhone,
        password: loginPassword
      });
      alert(res.data.message || 'লগইন সফল হয়েছে!');
      setActiveTab('search');
    } catch (err) {
      alert(err.response?.data?.message || 'মোবাইল নম্বর বা পাসওয়ার্ড ভুল!');
    }
  };

  const handleBloodRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/requests`, requestData);
      alert('রক্তের আবেদন জমা হয়েছে!');
      setActiveTab('all-requests');
    } catch (err) {
      alert('আবেদন জমা দিতে সমস্যা হয়েছে!');
    }
  };

  return (
    <div className="main-bg">
      <div className="card-container">
        <header className="header">
          <h1>🩸 যুবশক্তি ব্লাড ডোনেশন (কিশোরগঞ্জ) 🩸</h1>
        </header>

        <nav className="nav-buttons">
          <button className={activeTab === 'request' ? 'active' : ''} onClick={() => setActiveTab('request')}>
            🩸 রক্তের আবেদন
          </button>
          <button className={activeTab === 'register' ? 'active' : ''} onClick={() => setActiveTab('register')}>
            📝 রেজিস্ট্রেশন
          </button>
          <button className={activeTab === 'search' ? 'active' : ''} onClick={() => setActiveTab('search')}>
            🔍 ডোনার খুঁজুন
          </button>
          <button className={activeTab === 'all-requests' ? 'active' : ''} onClick={() => setActiveTab('all-requests')}>
            📋 সকল রিকোয়েস্ট
          </button>
          <button className={activeTab === 'login' ? 'active' : ''} onClick={() => setActiveTab('login')}>
            🔑 লগইন
          </button>
        </nav>

        <main className="content-section">
          {activeTab === 'request' && (
            <div>
              <h2>🩸 রক্তের জন্য আবেদন</h2>
              <form onSubmit={handleBloodRequest}>
                <div className="form-group">
                  <label>রোগীর নাম:</label>
                  <input
                    type="text"
                    required
                    value={requestData.patientName}
                    onChange={(e) => setRequestData({ ...requestData, patientName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>রোগীর সমস্যা:</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: অপারেশন / ডেঙ্গু"
                    value={requestData.problem}
                    onChange={(e) => setRequestData({ ...requestData, problem: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>রক্তের গ্রুপ প্রয়োজন:</label>
                  <select
                    value={requestData.bloodGroup}
                    onChange={(e) => setRequestData({ ...requestData, bloodGroup: e.target.value })}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>হিমোগ্লোবিন:</label>
                  <input
                    type="text"
                    placeholder="যেমন: 30%"
                    value={requestData.hemoglobin}
                    onChange={(e) => setRequestData({ ...requestData, hemoglobin: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>রক্তের পরিমাণ:</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ১ ব্যাগ"
                    value={requestData.amount}
                    onChange={(e) => setRequestData({ ...requestData, amount: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>রক্তদানের তারিখ:</label>
                  <input
                    type="date"
                    required
                    value={requestData.donationDate}
                    onChange={(e) => setRequestData({ ...requestData, donationDate: e.target.value })}
                  />
                  <small style={{ color: '#666', marginTop: '4px', fontSize: '12px' }}>
                    (ফরম্যাট: দিন / মাস / বছর)
                  </small>
                </div>

                <div className="form-group">
                  <label>রক্তদানের স্থান:</label>
                  <input
                    type="text"
                    required
                    placeholder="হাসপাতাল / এলাকার নাম"
                    value={requestData.donationPlace}
                    onChange={(e) => setRequestData({ ...requestData, donationPlace: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>যোগাযোগ:</label>
                  <input
                    type="tel"
                    required
                    placeholder="মোবাইল নম্বর"
                    value={requestData.contactPhone}
                    onChange={(e) => setRequestData({ ...requestData, contactPhone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>রেফারেন্স:</label>
                  <input
                    type="text"
                    placeholder="কারো রেফারেন্স থাকলে লিখুন"
                    value={requestData.reference}
                    onChange={(e) => setRequestData({ ...requestData, reference: e.target.value })}
                  />
                </div>

                <button type="submit" className="submit-btn">আবেদন পাঠান</button>
              </form>
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              <h2>🔍 ডোনার খুঁজুন</h2>
              <div className="form-group">
                <label>রক্তের গ্রুপ নির্বাচন করুন:</label>
                <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              {loadingDonors ? (
                <p className="loading-text">ডোনারের তথ্য লোড হচ্ছে...</p>
              ) : (
                <div className="donor-list">
                  {donors.length > 0 ? (
                    donors.map((donor, index) => (
                      <div key={index} className="donor-card">
                        <h3>{donor.name}</h3>
                        <p><strong>রক্তের গ্রুপ:</strong> {donor.bloodGroup}</p>
                        <p><strong>ফোন:</strong> {donor.phone}</p>
                        <p><strong>ঠিকানা:</strong> {donor.address}</p>
                      </div>
                    ))
                  ) : (
                    <p className="empty-text">এই রক্তের গ্রুপের কোনো ডোনার পাওয়া যায়নি।</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'login' && (
            <div>
              <h2>🔑 ডোনার লগইন</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>ইমেইল / মোবাইল নম্বর:</label>
                  <input
                    type="text"
                    placeholder="আপনার ফোন নম্বর লিখুন"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>পাসওয়ার্ড:</label>
                  <input
                    type="password"
                    placeholder="পাসওয়ার্ড লিখুন"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">লগইন</button>
              </form>
            </div>
          )}

          {activeTab === 'register' && (
            <div>
              <h2>📝 নতুন ডোনার রেজিস্ট্রেশন</h2>
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label>নাম:</label>
                  <input
                    type="text"
                    required
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>ইমেইল:</label>
                  <input
                    type="email"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>ফোন নম্বর:</label>
                  <input
                    type="tel"
                    required
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>রক্তের গ্রুপ:</label>
                  <select
                    value={regData.bloodGroup}
                    onChange={(e) => setRegData({ ...regData, bloodGroup: e.target.value })}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>ঠিকানা:</label>
                  <input
                    type="text"
                    required
                    value={regData.address}
                    onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>পাসওয়ার্ড:</label>
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>প্রোফাইল ছবি (ঐচ্ছিক):</label>
                  <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
                </div>

                <button type="submit" className="submit-btn">রেজিস্ট্রেশন সম্পূর্ণ করুন</button>
              </form>
            </div>
          )}

          {activeTab === 'all-requests' && (
            <div>
              <h2>📋 সকল রক্তের রিকোয়েস্ট</h2>
              <div className="donor-list">
                {requests.length > 0 ? (
                  requests.map((req, i) => (
                    <div key={i} className="donor-card">
                      <h3>রোগী: {req.patientName}</h3>
                      <p><strong>সমস্যা:</strong> {req.problem}</p>
                      <p><strong>প্রয়োজনীয় গ্রুপ:</strong> {req.bloodGroup}</p>
                      <p><strong>হিমোগ্লোবিন:</strong> {req.hemoglobin || 'N/A'}</p>
                      <p><strong>পরিমাণ:</strong> {req.amount}</p>
                      <p>
                        <strong>তারিখ:</strong>{' '}
                        {req.donationDate
                          ? req.donationDate.split('-').reverse().join('-')
                          : 'N/A'}
                      </p>
                      <p><strong>স্থান:</strong> {req.donationPlace}</p>
                      <p><strong>যোগাযোগ:</strong> {req.contactPhone}</p>
                      {req.reference && <p><strong>রেফারেন্স:</strong> {req.reference}</p>}
                    </div>
                  ))
                ) : (
                  <p className="empty-text">কোনো রিকোয়েস্ট পাওয়া যায়নি।</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;