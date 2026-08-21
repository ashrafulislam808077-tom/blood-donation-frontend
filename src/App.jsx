import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './assets/logo.png'; // লোগো ফাইল ইমপোর্ট নিশ্চিত করুন

const API_BASE_URL = 'https://blood-donation-backend-rscs.onrender.com/api';

function App() {
  const [selectedGroup, setSelectedGroup] = useState('A+');
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // ১. রক্তের আবেদনের স্টেট
  const [requestForm, setRequestForm] = useState({
    patientProblem: '',
    bloodGroup: 'A+',
    hemoglobin: '',
    amount: '',
    donationTime: '',
    donationDate: '',
    donationPlace: '',
    contactPhone: '',
    reference: ''
  });

  // ২. ডোনার রেজিস্ট্রেশনের স্টেট
  const [regForm, setRegForm] = useState({
    name: '',
    bloodGroup: 'A+',
    phone: '',
    password: '',
    email: '',
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

  // সাবমিট হ্যান্ডলারসমূহ
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/requests`, requestForm);
      alert(res.data.message);
      setRequestForm({ patientProblem: '', bloodGroup: 'A+', hemoglobin: '', amount: '', donationTime: '', donationDate: '', donationPlace: '', contactPhone: '', reference: '' });
      fetchRequests();
    } catch (err) {
      alert('রক্তের আবেদন জমা নিতে সমস্যা হয়েছে!');
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
      alert(res.data.message);
      setRegForm({ name: '', bloodGroup: 'A+', phone: '', password: '', email: '', address: '', securityAnswer: '' });
      setImageFile(null);
      fetchDonors(selectedGroup);
    } catch (err) {
      alert(err.response?.data?.message || 'রেজিস্ট্রেশনে ত্রুটি হয়েছে!');
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
      alert(err.response?.data?.message || 'পাসওয়ার্ড রিসেট সফল হয়নি!');
    }
  };

  return (
    <div style={styles.container}>
      {/* হেডার ও লোগো */}
      <header style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <div>
          <h1 style={styles.headerTitle}>যুবশক্তি ব্লাড ডোনেশন কিশোরগঞ্জ</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>রক্তদানই হোক আমাদের অঙ্গীকার</p>
        </div>
      </header>

      {/* ১. রক্তের আবেদন ফর্ম */}
      <section style={styles.card}>
        <h2 style={styles.cardTitle}>🩸 ১. রক্তের আবেদন করুন</h2>
        <form onSubmit={handleRequestSubmit} style={styles.formGrid}>
          <input type="text" placeholder="রোগীর সমস্যা" value={requestForm.patientProblem} onChange={(e) => setRequestForm({...requestForm, patientProblem: e.target.value})} style={styles.input} />
          
          <select value={requestForm.bloodGroup} onChange={(e) => setRequestForm({...requestForm, bloodGroup: e.target.value})} style={styles.input}>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          <input type="text" placeholder="হিমোগ্লোবিন" value={requestForm.hemoglobin} onChange={(e) => setRequestForm({...requestForm, hemoglobin: e.target.value})} style={styles.input} />
          <input type="text" placeholder="রক্তের পরিমাণ" value={requestForm.amount} onChange={(e) => setRequestForm({...requestForm, amount: e.target.value})} required style={styles.input} />
          <input type="text" placeholder="রক্ত দানের সময়" value={requestForm.donationTime} onChange={(e) => setRequestForm({...requestForm, donationTime: e.target.value})} style={styles.input} />
          <input type="text" placeholder="রক্তদানের তারিখ" value={requestForm.donationDate} onChange={(e) => setRequestForm({...requestForm, donationDate: e.target.value})} required style={styles.input} />
          <input type="text" placeholder="রক্তদানের স্থান" value={requestForm.donationPlace} onChange={(e) => setRequestForm({...requestForm, donationPlace: e.target.value})} required style={styles.input} />
          <input type="text" placeholder="যোগাযোগ" value={requestForm.contactPhone} onChange={(e) => setRequestForm({...requestForm, contactPhone: e.target.value})} required style={styles.input} />
          <input type="text" placeholder="রেফারেন্স (ঐচ্ছিক)" value={requestForm.reference} onChange={(e) => setRequestForm({...requestForm, reference: e.target.value})} style={styles.input} />
          
          <button type="submit" style={{ ...styles.btn, gridColumn: '1 / -1' }}>আবেদন জমা দিন</button>
        </form>
      </section>

      {/* ২. ডোনার রেজিস্ট্রেশন ফর্ম */}
      <section style={styles.card}>
        <h2 style={styles.cardTitle}>📝 ২. ডোনার রেজিস্ট্রেশন ফর্ম</h2>
        <form onSubmit={handleRegisterSubmit} style={styles.formGrid}>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={styles.input} />
          <input type="text" placeholder="নাম" value={regForm.name} onChange={(e) => setRegForm({...regForm, name: e.target.value})} required style={styles.input} />
          
          <select value={regForm.bloodGroup} onChange={(e) => setRegForm({...regForm, bloodGroup: e.target.value})} style={styles.input}>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          <input type="text" placeholder="নাম্বার" value={regForm.phone} onChange={(e) => setRegForm({...regForm, phone: e.target.value})} required style={styles.input} />
          <input type="password" placeholder="পাসওয়ার্ড" value={regForm.password} onChange={(e) => setRegForm({...regForm, password: e.target.value})} required style={styles.input} />
          <input type="email" placeholder="ইমেইল" value={regForm.email} onChange={(e) => setRegForm({...regForm, email: e.target.value})} style={styles.input} />
          <input type="text" placeholder="ঠিকানা" value={regForm.address} onChange={(e) => setRegForm({...regForm, address: e.target.value})} required style={styles.input} />
          
          <input 
            type="text" 
            placeholder="সিকুরিটি প্রশ্ন (উত্তর দিন)" 
            value={regForm.securityAnswer} 
            onChange={(e) => setRegForm({...regForm, securityAnswer: e.target.value})} 
            required 
            style={{ ...styles.input, gridColumn: '1 / -1' }} 
          />

          <button type="submit" style={{ ...styles.btn, gridColumn: '1 / -1', backgroundColor: '#27ae60' }}>রেজিস্ট্রেশন করুন</button>
        </form>
      </section>

      {/* ৩. ডোনার খুঁজুন */}
      <section style={styles.card}>
        <h2 style={styles.cardTitle}>🔍 ৩. ডোনার খুঁজুন</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>ব্লাড গ্রুপ নির্বাচন করুন:</label>
          <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} style={styles.input}>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {loading ? <p>ডাটা লোড হচ্ছে...</p> : (
          <div style={styles.donorList}>
            {donors.map(donor => (
              <div key={donor._id} style={styles.donorCard}>
                {donor.imageUrl && <img src={`https://blood-donation-backend-rscs.onrender.com${donor.imageUrl}`} alt="Donor" style={styles.donorImg} />}
                <h4>{donor.name} ({donor.bloodGroup})</h4>
                <p>📞 {donor.phone}</p>
                <p>📍 {donor.address}</p>
              </div>
            ))}
            {donors.length === 0 && <p>এই গ্রুপের কোনো ডোনার পাওয়া যায়নি।</p>}
          </div>
        )}
      </section>

      {/* ৪. ডোনার লগইন ও সিকিউরিটি পাসওয়ার্ড রিসেট */}
      <section style={styles.card}>
        <h2 style={styles.cardTitle}>🔑 ৪. ডোনার লগইন</h2>
        {user ? (
          <div>
            <h3>স্বাগতম, {user.name}!</h3>
            <p>আপনার অ্যাকাউন্ট লগইন অবস্থায় রয়েছে।</p>
            <button onClick={() => setUser(null)} style={{ ...styles.btn, backgroundColor: '#7f8c8d' }}>লগআউট</button>
          </div>
        ) : !showReset ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
            <input type="text" placeholder="নাম্বার" value={loginForm.phone} onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})} required style={styles.input} />
            <input type="password" placeholder="পাসওয়ার্ড" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} required style={styles.input} />
            <button type="submit" style={styles.btn}>লগইন</button>
            <button type="button" onClick={() => setShowReset(true)} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', textAlign: 'left' }}>পাসওয়ার্ড ভুলে গেছেন?</button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
            <h3>পাসওয়ার্ড রিসেট</h3>
            <input type="text" placeholder="নাম্বার" value={resetForm.phone} onChange={(e) => setResetForm({...resetForm, phone: e.target.value})} required style={styles.input} />
            <input type="text" placeholder="সিকুরিটি প্রশ্নের উত্তর" value={resetForm.securityAnswer} onChange={(e) => setResetForm({...resetForm, securityAnswer: e.target.value})} required style={styles.input} />
            <input type="password" placeholder="নতুন পাসওয়ার্ড" value={resetForm.newPassword} onChange={(e) => setResetForm({...resetForm, newPassword: e.target.value})} required style={styles.input} />
            <button type="submit" style={{ ...styles.btn, backgroundColor: '#e67e22' }}>পাসওয়ার্ড পরিবর্তন করুন</button>
            <button type="button" onClick={() => setShowReset(false)} style={{ background: 'none', border: 'none', color: '#7f8c8d', cursor: 'pointer' }}>ফিরে যান</button>
          </form>
        )}
      </section>

      {/* সাম্প্রতিক রিকোয়েস্টসমূহ */}
      <section style={styles.card}>
        <h2 style={styles.cardTitle}>📢 সম্প্রতি করা রক্তের রিকোয়েস্টসমূহ</h2>
        <div style={styles.donorList}>
          {requests.map(req => (
            <div key={req._id} style={styles.requestItem}>
              <span style={styles.badge}>{req.bloodGroup}</span>
              <p><strong>রোগীর সমস্যা:</strong> {req.patientProblem}</p>
              <p><strong>পরিমাণ:</strong> {req.amount} | <strong>হিমোগ্লোবিন:</strong> {req.hemoglobin || 'N/A'}</p>
              <p><strong>তারিখ ও সময়:</strong> {req.donationDate} ({req.donationTime})</p>
              <p><strong>স্থান:</strong> {req.donationPlace}</p>
              <p><strong>যোগাযোগ:</strong> {req.contactPhone}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f7' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#c0392b', color: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px' },
  logo: { width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #fff' },
  headerTitle: { margin: 0, fontSize: '24px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  cardTitle: { borderBottom: '2px solid #c0392b', paddingBottom: '8px', marginTop: 0, color: '#2c3e50' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px' },
  btn: { padding: '10px 15px', backgroundColor: '#c0392b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  donorList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' },
  donorCard: { padding: '15px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fafafa' },
  donorImg: { width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' },
  requestItem: { position: 'relative', padding: '15px', borderLeft: '4px solid #c0392b', backgroundColor: '#fff5f5', borderRadius: '4px' },
  badge: { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#c0392b', color: '#fff', padding: '3px 8px', borderRadius: '10px', fontSize: '12px' }
};

export default App;