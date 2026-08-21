import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://blood-donation-backend-rscs.onrender.com/api';

function App() {
  const [activeTab, setActiveTab] = useState('register'); // ডিফল্ট ট্যাব 'রেজিস্ট্রেশন'
  const [selectedGroup, setSelectedGroup] = useState('A+');
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // ১. রক্তের আবেদন স্টেট
  const [requestForm, setRequestForm] = useState({
    patientName: '',
    patientProblem: '',
    bloodGroup: 'A+',
    hemoglobin: '',
    amount: '1',
    donationTime: '',
    donationPlace: '',
    contactPhone: '',
    reference: ''
  });

  // ২. ডোনার রেজিস্ট্রেশন স্টেট
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    bloodGroup: 'A+',
    phone: '',
    address: '',
    securityAnswer: ''
  });
  const [imageFile, setImageFile] = useState(null);

  // ৩. লগইন ও পাসওয়ার্ড রিসেট স্টেট
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
  const [showReset, setShowReset] = useState(false);
  const [resetForm, setResetForm] = useState({ phone: '', securityAnswer: '', newPassword: '' });

  const fetchDonors = async (group) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/donors?group=${encodeURIComponent(group)}`);
      setDonors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/requests`);
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setRequests([]);
    }
  };

  useEffect(() => {
    fetchDonors(selectedGroup);
    fetchRequests();
  }, [selectedGroup]);

  // হ্যান্ডলারসমূহ
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/requests`, requestForm);
      alert(res.data.message || 'রক্তের আবেদন সফল হয়েছে!');
      setRequestForm({
        patientName: '', patientProblem: '', bloodGroup: 'A+',
        hemoglobin: '', amount: '1', donationTime: '',
        donationPlace: '', contactPhone: '', reference: ''
      });
      fetchRequests();
    } catch (err) {
      alert('আবেদন জমা নিতে সমস্যা হয়েছে!');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(regForm).forEach(key => formData.append(key, regForm[key]));
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await axios.post(`${API_BASE_URL}/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(res.data.message || 'রেজিস্ট্রেশন সফল হয়েছে!');
      setRegForm({ name: '', email: '', password: '', bloodGroup: 'A+', phone: '', address: '', securityAnswer: '' });
      setImageFile(null);
      fetchDonors(selectedGroup);
    } catch (err) {
      alert(err.response?.data?.message || 'রেজিস্ট্রেশনে সমস্যা হয়েছে!');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, loginForm);
      alert('লগইন সফল হয়েছে!');
      setUser(res.data.user);
      setLoginForm({ phone: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'লগইন তথ্য সঠিক নয়!');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/reset-password`, resetForm);
      alert(res.data.message);
      setShowReset(false);
      setResetForm({ phone: '', securityAnswer: '', newPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'পাসওয়ার্ড রিসেট সম্ভব হয়নি!');
    }
  };

  const handleDeleteRequest = async (id) => {
    if (window.confirm('আপনি কি এই রিকোয়েস্টটি মুছে ফেলতে চান?')) {
      try {
        await axios.delete(`${API_BASE_URL}/requests/${id}`);
        alert('আবেদনটি মুছে ফেলা হয়েছে।');
        fetchRequests();
      } catch (err) {
        alert('ডিলিট করতে সমস্যা হয়েছে!');
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* হেডার */}
      <div style={styles.headerTitleContainer}>
        <h1 style={styles.headerTitle}>🩸 যুবশক্তি ব্লাড ডোনেশন (কিশোরগঞ্জ) 🩸</h1>
      </div>

      {/* ২য় ছবির মতো নেভিগেশন ট্যাব */}
      <div style={styles.tabContainer}>
        <button 
          style={activeTab === 'request' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('request')}>
          🩸 রক্তের আবেদন
        </button>
        <button 
          style={activeTab === 'register' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('register')}>
          📝 রেজিস্ট্রেশন
        </button>
        <button 
          style={activeTab === 'search' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('search')}>
          🔍 ডোনার খুঁজুন
        </button>
        <button 
          style={activeTab === 'all_requests' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('all_requests')}>
          📋 সকল রিকোয়েস্ট
        </button>
        <button 
          style={activeTab === 'login' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('login')}>
          🔑 লগইন
        </button>
      </div>

      <div style={styles.card}>
        {/* ১. রক্তের আবেদন ট্যাব */}
        {activeTab === 'request' && (
          <div>
            <h2 style={styles.sectionHeader}>🩸 রক্তের আবেদন করুন</h2>
            <form onSubmit={handleRequestSubmit} style={styles.formContainer}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>রোগীর নাম:</label>
                <input type="text" placeholder="রোগীর নাম লিখুন" value={requestForm.patientName} onChange={(e) => setRequestForm({...requestForm, patientName: e.target.value})} style={styles.input} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>রোগীর সমস্যা/কারণ:</label>
                <input type="text" placeholder="সমস্যা লিখুন" value={requestForm.patientProblem} onChange={(e) => setRequestForm({...requestForm, patientProblem: e.target.value})} style={styles.input} />
              </div>

              <div style={styles.rowGrid}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>রক্তের গ্রুপ:</label>
                  <select value={requestForm.bloodGroup} onChange={(e) => setRequestForm({...requestForm, bloodGroup: e.target.value})} style={styles.input}>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>রক্তের পরিমাণ (ব্যাগ):</label>
                  <input type="text" value={requestForm.amount} onChange={(e) => setRequestForm({...requestForm, amount: e.target.value})} required style={styles.input} />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>হিমোগ্লোবিন (যদি জানা থাকে):</label>
                <input type="text" placeholder="হিমোগ্লোবিন লিখুন" value={requestForm.hemoglobin} onChange={(e) => setRequestForm({...requestForm, hemoglobin: e.target.value})} style={styles.input} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>রক্তদানের তারিখ/সময়:</label>
                <input type="text" placeholder="যেমন: ১০ অক্টোবর, সকাল ১০টা" value={requestForm.donationTime} onChange={(e) => setRequestForm({...requestForm, donationTime: e.target.value})} required style={styles.input} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>হাসপাতাল/স্থান:</label>
                <input type="text" placeholder="হাসপাতালের নাম ও ঠিকানা" value={requestForm.donationPlace} onChange={(e) => setRequestForm({...requestForm, donationPlace: e.target.value})} required style={styles.input} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>যোগাযোগ নম্বর:</label>
                <input type="text" placeholder="মোবাইল নম্বর লিখুন" value={requestForm.contactPhone} onChange={(e) => setRequestForm({...requestForm, contactPhone: e.target.value})} required style={styles.input} />
              </div>

              <button type="submit" style={styles.submitBtn}>আবেদন জমা দিন</button>
            </form>
          </div>
        )}

        {/* ২. ডোনার রেজিস্ট্রেশন ট্যাব */}
        {activeTab === 'register' && (
          <div>
            <h2 style={styles.sectionHeader}>📝 নতুন ডোনার রেজিস্ট্রেশন</h2>
            <form onSubmit={handleRegisterSubmit} style={styles.formContainer}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>নাম:</label>
                <input type="text" placeholder="আপনার নাম" value={regForm.name} onChange={(e) => setRegForm({...regForm, name: e.target.value})} required style={styles.input} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>ইমেইল:</label>
                <input type="email" placeholder="ইমেইল অ্যাড্রেস" value={regForm.email} onChange={(e) => setRegForm({...regForm, email: e.target.value})} style={styles.input} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>পাসওয়ার্ড:</label>
                <input type="password" placeholder="পাসওয়ার্ড" value={regForm.password} onChange={(e) => setRegForm({...regForm, password: e.target.value})} required style={styles.input} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>রক্তের গ্রুপ:</label>
                <select value={regForm.bloodGroup} onChange={(e) => setRegForm({...regForm, bloodGroup: e.target.value})} style={styles.input}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>ফোন নম্বর:</label>
                <input type="text" placeholder="ফোন নম্বর" value={regForm.phone} onChange={(e) => setRegForm({...regForm, phone: e.target.value})} required style={styles.input} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>ঠিকানা:</label>
                <input type="text" placeholder="বর্তমান ঠিকানা" value={regForm.address} onChange={(e) => setRegForm({...regForm, address: e.target.value})} required style={styles.input} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>সিকিউরিটি প্রশ্নের উত্তর (পাসওয়ার্ড রিসেটের জন্য):</label>
                <input type="text" placeholder="যেমন: প্রিয় রঙ/স্কুলের নাম" value={regForm.securityAnswer} onChange={(e) => setRegForm({...regForm, securityAnswer: e.target.value})} required style={styles.input} />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>প্রোফাইল ছবি (ঐচ্ছিক):</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={styles.input} />
              </div>

              <button type="submit" style={{ ...styles.submitBtn, backgroundColor: '#800000' }}>রেজিস্ট্রেশন সম্পূর্ণ করুন</button>
            </form>
          </div>
        )}

        {/* ৩. ডোনার খুঁজুন ট্যাব */}
        {activeTab === 'search' && (
          <div>
            <h2 style={styles.sectionHeader}>🔍 ডোনার খুঁজুন</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}>রক্তের গ্রুপ নির্বাচন করুন:</label>
              <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} style={styles.input}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {loading ? <p>ডাটা লোড হচ্ছে...</p> : (
              <div style={styles.gridList}>
                {donors.map(donor => (
                  <div key={donor._id} style={styles.cardItem}>
                    {donor.imageUrl && <img src={`https://blood-donation-backend-rscs.onrender.com${donor.imageUrl}`} alt="Donor" style={styles.donorImg} />}
                    <h3 style={{ margin: '5px 0' }}>{donor.name} ({donor.bloodGroup})</h3>
                    <p style={{ margin: '3px 0' }}>📞 {donor.phone}</p>
                    <p style={{ margin: '3px 0' }}>📍 {donor.address}</p>
                  </div>
                ))}
                {donors.length === 0 && <p style={{ color: '#777' }}>এই গ্রুপের কোনো রক্তদাতা ডাটাবেজে পাওয়া যায়নি।</p>}
              </div>
            )}
          </div>
        )}

        {/* ৪. সকল রিকোয়েস্ট ট্যাব */}
        {activeTab === 'all_requests' && (
          <div>
            <h2 style={styles.sectionHeader}>📋 সকল রক্তের রিকোয়েস্ট</h2>
            <div style={styles.gridList}>
              {requests.map(req => (
                <div key={req._id} style={styles.requestCard}>
                  <span style={styles.badge}>{req.bloodGroup}</span>
                  <p style={{ margin: '4px 0' }}><strong>রোগীর নাম/সমস্যা:</strong> {req.patientName || 'N/A'} ({req.patientProblem})</p>
                  <p style={{ margin: '4px 0' }}><strong>পরিমাণ:</strong> {req.amount} ব্যাগ | <strong>হিমোগ্লোবিন:</strong> {req.hemoglobin || 'N/A'}</p>
                  <p style={{ margin: '4px 0' }}><strong>তারিখ ও সময়:</strong> {req.donationTime}</p>
                  <p style={{ margin: '4px 0' }}><strong>স্থান:</strong> {req.donationPlace}</p>
                  <p style={{ margin: '4px 0' }}><strong>যোগাযোগ:</strong> {req.contactPhone}</p>
                  <button onClick={() => handleDeleteRequest(req._id)} style={styles.deleteBtn}>মুছে ফেলুন</button>
                </div>
              ))}
              {requests.length === 0 && <p>কোনো সক্রিয় রক্তের আবেদন নেই।</p>}
            </div>
          </div>
        )}

        {/* ৫. লগইন ট্যাব */}
        {activeTab === 'login' && (
          <div>
            <h2 style={styles.sectionHeader}>🔑 ডোনার লগইন</h2>
            {user ? (
              <div style={{ textAlign: 'center' }}>
                <h3>স্বাগতম, {user.name}!</h3>
                <p>আপনি সফলভাবে লগইন করেছেন।</p>
                <button onClick={() => setUser(null)} style={styles.deleteBtn}>লগআউট</button>
              </div>
            ) : !showReset ? (
              <form onSubmit={handleLoginSubmit} style={{ ...styles.formContainer, maxWidth: '400px', margin: '0 auto' }}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>ফোন নম্বর:</label>
                  <input type="text" placeholder="ফোন নম্বর লিখুন" value={loginForm.phone} onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})} required style={styles.input} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>পাসওয়ার্ড:</label>
                  <input type="password" placeholder="পাসওয়ার্ড লিখুন" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} required style={styles.input} />
                </div>
                <button type="submit" style={styles.submitBtn}>লগইন</button>
                <button type="button" onClick={() => setShowReset(true)} style={styles.linkBtn}>পাসওয়ার্ড ভুলে গেছেন?</button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} style={{ ...styles.formContainer, maxWidth: '400px', margin: '0 auto' }}>
                <h3>পাসওয়ার্ড রিসেট</h3>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>ফোন নম্বর:</label>
                  <input type="text" placeholder="ফোন নম্বর" value={resetForm.phone} onChange={(e) => setResetForm({...resetForm, phone: e.target.value})} required style={styles.input} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>সিকিউরিটি প্রশ্নের উত্তর:</label>
                  <input type="text" placeholder="উত্তর লিখুন" value={resetForm.securityAnswer} onChange={(e) => setResetForm({...resetForm, securityAnswer: e.target.value})} required style={styles.input} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>নতুন পাসওয়ার্ড:</label>
                  <input type="password" placeholder="নতুন পাসওয়ার্ড" value={resetForm.newPassword} onChange={(e) => setResetForm({...resetForm, newPassword: e.target.value})} required style={styles.input} />
                </div>
                <button type="submit" style={{ ...styles.submitBtn, backgroundColor: '#e67e22' }}>পাসওয়ার্ড পরিবর্তন করুন</button>
                <button type="button" onClick={() => setShowReset(false)} style={styles.linkBtn}>ফিরে যান</button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '850px', margin: '0 auto', padding: '15px', fontFamily: 'Arial, sans-serif' },
  headerTitleContainer: { textAlign: 'center', marginBottom: '20px' },
  headerTitle: { color: '#800000', fontSize: '26px', margin: 0 },
  tabContainer: { display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' },
  tabBtn: { padding: '10px 16px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#e8ecef', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: '#333' },
  activeTabBtn: { padding: '10px 16px', border: 'none', borderRadius: '6px', backgroundColor: '#800000', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: '#fff' },
  card: { backgroundColor: '#fff', border: '1px solid #e1e1e1', borderRadius: '8px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  sectionHeader: { textAlign: 'center', color: '#800000', borderBottom: '1px solid #800000', paddingBottom: '8px', marginTop: 0, marginBottom: '20px', fontSize: '20px' },
  formContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', textAlign: 'center' },
  label: { fontWeight: 'bold', marginBottom: '6px', fontSize: '15px', color: '#222' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px', textAlign: 'left' },
  rowGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  submitBtn: { padding: '12px', backgroundColor: '#800000', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
  gridList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '15px' },
  cardItem: { border: '1px solid #eee', padding: '12px', borderRadius: '6px', textAlign: 'center', backgroundColor: '#fdfdfd' },
  donorImg: { width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' },
  requestCard: { borderLeft: '4px solid #800000', backgroundColor: '#fff8f8', padding: '12px', borderRadius: '4px', position: 'relative' },
  badge: { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#800000', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' },
  deleteBtn: { marginTop: '8px', padding: '5px 10px', backgroundColor: '#c0392b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  linkBtn: { background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', marginTop: '8px' }
};

export default App;