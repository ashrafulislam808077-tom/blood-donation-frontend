import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo.png'; // লোগো ফাইল ইম্পোর্ট

const API_BASE_URL = 'https://blood-donation-backend-56c5.onrender.com';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  
  // Blood Request State
  const [reqData, setReqData] = useState({
    patientName: '',
    problem: '',
    bloodGroup: 'A+',
    hemoglobin: '',
    units: '',
    donationDate: '',
    donationPlace: '',
    contactPhone: '',
    reference: ''
  });

  // Registration State
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: 'A+',
    address: '',
    password: ''
  });
  const [profilePic, setProfilePic] = useState(null);

  // Login State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Search & Request Lists
  const [selectedGroup, setSelectedGroup] = useState('A+');
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);

  // Fetch Donors
  const fetchDonors = async (group) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/donors?group=${encodeURIComponent(group)}`);
      setDonors(res.data);
    } catch (err) {
      console.error('Donors fetch error:', err);
    }
  };

  // Fetch Requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/requests`);
      setRequests(res.data);
    } catch (err) {
      console.error('Requests fetch error:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'search') {
      fetchDonors(selectedGroup);
    } else if (activeTab === 'all-requests') {
      fetchRequests();
    }
  }, [activeTab, selectedGroup]);

  const handleReqChange = (e) => setReqData({ ...reqData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  // Submit Request
  const handleReqSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patientName: reqData.patientName,
        problem: reqData.problem,
        bloodGroup: reqData.bloodGroup,
        hemoglobin: reqData.hemoglobin,
        amount: reqData.units,
        units: reqData.units,
        donationDate: reqData.donationDate,
        donationPlace: reqData.donationPlace,
        contactPhone: reqData.contactPhone,
        reference: reqData.reference
      };
      
      const res = await axios.post(`${API_BASE_URL}/api/requests`, payload);
      alert(res.data.message || 'রক্তের আবেদন সফলভাবে জমা হয়েছে!');
      setReqData({
        patientName: '',
        problem: '',
        bloodGroup: 'A+',
        hemoglobin: '',
        units: '',
        donationDate: '',
        donationPlace: '',
        contactPhone: '',
        reference: ''
      });
      setActiveTab('all-requests');
    } catch (err) {
      console.error('Request Error Details:', err.response?.data || err.message);
      const errMsg = err.response?.data?.message || err.response?.data?.error || 'আবেদন জমা দিতে সমস্যা হয়েছে!';
      alert(errMsg);
    }
  };

  // Submit Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', registerData.name);
    formData.append('email', registerData.email);
    formData.append('phone', registerData.phone.trim());
    formData.append('bloodGroup', registerData.bloodGroup);
    formData.append('address', registerData.address);
    formData.append('password', registerData.password.trim());

    if (profilePic) {
      formData.append('image', profilePic);
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/register`, formData);
      alert(res.data.message || 'রেজিস্ট্রেশন সফল হয়েছে!');
      setRegisterData({ name: '', email: '', phone: '', bloodGroup: 'A+', address: '', password: '' });
      setProfilePic(null);
      setActiveTab('login');
    } catch (err) {
      alert(err.response?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে!');
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, {
        phone: loginPhone.trim(),
        password: loginPassword.trim()
      });
      alert(res.data.message || 'লগইন সফল হয়েছে!');
      setCurrentUser(res.data.user);
      setActiveTab('search');
    } catch (err) {
      alert(err.response?.data?.message || 'মোবাইল নম্বর বা পাসওয়ার্ড ভুল!');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo-title-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '45px', height: '45px', marginRight: '12px', borderRadius: '50%' }} />
          <h1>যুবশক্তি ব্লাড ডোনেশন (কিশোরগঞ্জ)</h1>
        </div>
        {currentUser && <p className="welcome-tag">স্বাগতম, {currentUser.name}!</p>}
        
        <div className="nav-buttons">
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
        </div>
      </header>

      <main className="content">
        {/* ১. রক্তের আবেদন */}
        {activeTab === 'request' && (
          <form onSubmit={handleReqSubmit} className="form-card">
            <h2>🩸 রক্তের আবেদন জানান</h2>
            
            <div className="form-group">
              <label>রোগীর নাম:</label>
              <input type="text" name="patientName" value={reqData.patientName} onChange={handleReqChange} required />
            </div>

            <div className="form-group">
              <label>রোগীর সমস্যা:</label>
              <input type="text" name="problem" value={reqData.problem} onChange={handleReqChange} />
            </div>

            <div className="form-group">
              <label>রক্তের গ্রুপ:</label>
              <select name="bloodGroup" value={reqData.bloodGroup} onChange={handleReqChange}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>হিমোগ্লোবিন (%):</label>
              <input type="text" name="hemoglobin" value={reqData.hemoglobin} onChange={handleReqChange} />
            </div>

            <div className="form-group">
              <label>রক্তের পরিমাণ (ব্যাগ):</label>
              <input type="text" name="units" value={reqData.units} onChange={handleReqChange} required />
            </div>

            <div className="form-group">
              <label>রক্তদানের তারিখ (dd/mm/yyyy):</label>
              <input type="text" name="donationDate" placeholder="dd/mm/yyyy" value={reqData.donationDate} onChange={handleReqChange} required />
            </div>

            <div className="form-group">
              <label>রক্তদানের স্থান:</label>
              <input type="text" name="donationPlace" value={reqData.donationPlace} onChange={handleReqChange} required />
            </div>

            <div className="form-group">
              <label>যোগাযোগের নম্বর:</label>
              <input type="tel" name="contactPhone" value={reqData.contactPhone} onChange={handleReqChange} required />
            </div>

            <div className="form-group">
              <label>রেফারেন্স (ঐচ্ছিক):</label>
              <input type="text" name="reference" value={reqData.reference} onChange={handleReqChange} />
            </div>

            <button type="submit" className="submit-btn">আবেদন জমা দিন</button>
          </form>
        )}

        {/* ২. রেজিস্ট্রেশন */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="form-card">
            <h2>📝 ডোনার রেজিস্ট্রেশন</h2>

            <div className="form-group">
              <label>নাম:</label>
              <input type="text" name="name" value={registerData.name} onChange={handleRegisterChange} required />
            </div>

            <div className="form-group">
              <label>ইমেইল (ঐচ্ছিক):</label>
              <input type="email" name="email" value={registerData.email} onChange={handleRegisterChange} />
            </div>

            <div className="form-group">
              <label>ফোন নম্বর:</label>
              <input type="tel" name="phone" value={registerData.phone} onChange={handleRegisterChange} required />
            </div>

            <div className="form-group">
              <label>রক্তের গ্রুপ:</label>
              <select name="bloodGroup" value={registerData.bloodGroup} onChange={handleRegisterChange}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>ঠিকানা:</label>
              <input type="text" name="address" value={registerData.address} onChange={handleRegisterChange} required />
            </div>

            <div className="form-group">
              <label>পাসওয়ার্ড:</label>
              <input type="password" name="password" value={registerData.password} onChange={handleRegisterChange} required />
            </div>

            <div className="form-group">
              <label>প্রোফাইল ছবি (ঐচ্ছিক):</label>
              <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} />
            </div>

            <button type="submit" className="submit-btn">রেজিস্ট্রেশন সম্পন্ন করুন</button>
          </form>
        )}

        {/* ৩. ডোনার খোঁজা */}
        {activeTab === 'search' && (
          <div>
            <h2>🔍 ডোনার খুঁজুন</h2>
            <div className="filter-box">
              <label>রক্তের গ্রুপ নির্বাচন করুন: </label>
              <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="donor-list">
              {donors.length > 0 ? (
                donors.map((donor, idx) => (
                  <div key={idx} className="donor-card">
                    {donor.imageUrl ? (
                      <img src={`${API_BASE_URL}${donor.imageUrl}`} alt={donor.name} className="donor-img" />
                    ) : (
                      <div className="no-img">ছবি নেই</div>
                    )}
                    <h3>{donor.name}</h3>
                    <p><strong>রক্তের গ্রুপ:</strong> {donor.bloodGroup}</p>
                    <p><strong>ফোন:</strong> <a href={`tel:${donor.phone}`}>{donor.phone}</a></p>
                    <p><strong>ঠিকানা:</strong> {donor.address || 'N/A'}</p>
                  </div>
                ))
              ) : (
                <p className="empty-text">এই গ্রুপের কোনো ডোনার পাওয়া যায়নি।</p>
              )}
            </div>
          </div>
        )}

        {/* ৪. সকল রিকোয়েস্ট */}
        {activeTab === 'all-requests' && (
          <div>
            <h2>📋 সকল রক্তের রিকোয়েস্ট</h2>
            <div className="donor-list">
              {requests.length > 0 ? (
                requests.map((req, idx) => (
                  <div key={idx} className="donor-card">
                    <h3>রিকোয়েস্ট নং: #{req.reqNo || (requests.length - idx)}</h3>
                    <p><strong>রোগী:</strong> {req.patientName}</p>
                    <p><strong>সমস্যা:</strong> {req.problem || 'N/A'}</p>
                    <p><strong>গ্রুপ:</strong> <span className="group-badge">{req.bloodGroup}</span></p>
                    <p><strong>হিমোগ্লোবিন:</strong> {req.hemoglobin || 'N/A'}</p>
                    <p><strong>পরিমাণ:</strong> {req.units || req.amount} ব্যাগ</p>
                    <p><strong>তারিখ:</strong> {req.donationDate || 'N/A'}</p>
                    <p><strong>স্থান:</strong> {req.donationPlace}</p>
                    <p><strong>যোগাযোগ:</strong> <a href={`tel:${req.contactPhone}`}>{req.contactPhone}</a></p>
                    {req.reference && <p><strong>রেফারেন্স:</strong> {req.reference}</p>}
                  </div>
                ))
              ) : (
                <p className="empty-text">কোনো রিকোয়েস্ট পাওয়া যায়নি।</p>
              )}
            </div>
          </div>
        )}

        {/* ৫. ডোনার লগইন */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="form-card">
            <h2>🔑 ডোনার লগইন</h2>

            <div className="form-group">
              <label>মোবাইল নম্বর:</label>
              <input type="tel" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>পাসওয়ার্ড:</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
            </div>

            <button type="submit" className="submit-btn">লগইন</button>
          </form>
        )}
      </main>
    </div>
  );
}

export default App;