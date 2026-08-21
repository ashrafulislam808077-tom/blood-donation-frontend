import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ✅ Render ব্যাকএন্ডের সঠিক URL
const API_BASE_URL = 'https://blood-donation-backend-rscs.onrender.com/api';

function App() {
  const [selectedGroup, setSelectedGroup] = useState('A+');
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('চেকিং...');

  // নতুন রক্তের আবেদনের ফর্ম স্টেট
  const [requestForm, setRequestForm] = useState({
    patientName: '',
    problem: '',
    bloodGroup: 'A+',
    hemoglobin: '',
    units: '1',
    donationDate: '',
    donationPlace: '',
    contactPhone: '',
    reference: ''
  });

  // ডোনারদের তালিকা ফেচ করা (Safe Response Handling)
  const fetchDonors = async (group) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/donors?group=${encodeURIComponent(group)}`);
      // অ্যারে সরাসরি না আসলেও সেফলি হ্যান্ডেল করবে
      const donorData = Array.isArray(response.data) ? response.data : (response.data.donors || []);
      setDonors(donorData);
      setServerStatus('সচল (Connected)');
    } catch (error) {
      console.error('Donors fetch error:', error);
      setDonors([]);
      setServerStatus('সার্ভার কানেকশন সমস্যা! কিছুক্ষন পর চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  // রক্তের রিকোয়েস্টগুলোর তালিকা ফেচ করা
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/requests`);
      const requestData = Array.isArray(response.data) ? response.data : (response.data.requests || []);
      setRequests(requestData);
    } catch (error) {
      console.error('Requests fetch error:', error);
      setRequests([]);
    }
  };

  useEffect(() => {
    fetchDonors(selectedGroup);
    fetchRequests();
  }, [selectedGroup]);

  // রক্তের আবেদনের সাবমিট হ্যান্ডলার
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/requests`, requestForm);
      alert(response.data.message || 'রক্তের আবেদন সফলভাবে জমা হয়েছে!');
      
      setRequestForm({
        patientName: '',
        problem: '',
        bloodGroup: 'A+',
        hemoglobin: '',
        units: '1',
        donationDate: '',
        donationPlace: '',
        contactPhone: '',
        reference: ''
      });
      
      fetchRequests();
    } catch (error) {
      console.error('Request Error Details:', error);
      alert('রক্তের আবেদন জমা নিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const handleInputChange = (e) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={styles.container}>
      {/* হেডার সেকশন */}
      <header style={styles.header}>
        <h1 style={styles.title}>যুবশক্তি রক্তদান সেবা</h1>
        <p style={styles.subtitle}>Juboshokti Blood Donation Platform</p>
        <span style={{ fontSize: '12px', opacity: 0.8 }}>সার্ভার স্টেটাস: {serverStatus}</span>
      </header>

      {/* মূল কন্টেন্ট গ্রিড */}
      <div style={styles.grid}>
        {/* বামপাশে: ডোনার সার্চ সেকশন */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>🩸 ডোনার খুঁজুন</h2>
          <div style={styles.filterBox}>
            <label style={{ fontWeight: 'bold' }}>রক্তের গ্রুপ নির্বাচন করুন: </label>
            <select 
              value={selectedGroup} 
              onChange={(e) => setSelectedGroup(e.target.value)}
              style={styles.selectInput}
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: '20px' }}>
            {loading ? (
              <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>সার্ভার থেকে ডাটা লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
            ) : donors.length > 0 ? (
              <div style={styles.listContainer}>
                {donors.map((donor, idx) => (
                  <div key={donor._id || idx} style={styles.listItem}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#c0392b' }}>{donor.name} ({donor.bloodGroup})</h4>
                    <p style={{ margin: '2px 0', fontSize: '14px' }}>📍 ঠিকানা: {donor.address || 'উল্লেখ নেই'}</p>
                    <p style={{ margin: '2px 0', fontSize: '14px' }}>📞 ফোন: <strong>{donor.phone}</strong></p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#7f8c8d' }}>এই গ্রুপের কোনো রক্তদাতা ডাটাবেজে পাওয়া যায়নি।</p>
            )}
          </div>
        </section>

        {/* ডানপাশে: রক্তের ফর্ম সেকশন */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>📝 রক্তের আবেদন করুন</h2>
          <form onSubmit={handleRequestSubmit} style={styles.form}>
            <input type="text" name="patientName" placeholder="রোগীর নাম" value={requestForm.patientName} onChange={handleInputChange} required style={styles.input} />
            <input type="text" name="problem" placeholder="রোগীর সমস্যা/কারণ" value={requestForm.problem} onChange={handleInputChange} style={styles.input} />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <select name="bloodGroup" value={requestForm.bloodGroup} onChange={handleInputChange} style={{ ...styles.input, flex: 1 }}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
              <input type="text" name="units" placeholder="কত ব্যাগ" value={requestForm.units} onChange={handleInputChange} required style={{ ...styles.input, flex: 1 }} />
            </div>

            <input type="text" name="hemoglobin" placeholder="হিমোগ্লোবিন (যদি জানা থাকে)" value={requestForm.hemoglobin} onChange={handleInputChange} style={styles.input} />
            <input type="text" name="donationDate" placeholder="রক্তদানের তারিখ/সময়" value={requestForm.donationDate} onChange={handleInputChange} required style={styles.input} />
            <input type="text" name="donationPlace" placeholder="হাসপাতাল/স্থান" value={requestForm.donationPlace} onChange={handleInputChange} required style={styles.input} />
            <input type="text" name="contactPhone" placeholder="যোগাযোগের মোবাইল নম্বর" value={requestForm.contactPhone} onChange={handleInputChange} required style={styles.input} />
            <input type="text" name="reference" placeholder="রেফারেন্স (ঐচ্ছিক)" value={requestForm.reference} onChange={handleInputChange} style={styles.input} />
            
            <button type="submit" style={styles.submitBtn}>আবেদন জমা দিন</button>
          </form>
        </section>
      </div>

      {/* নিচে: সাম্প্রতিক রক্তের রিকোয়েস্ট */}
      <section style={{ ...styles.card, marginTop: '30px' }}>
        <h2 style={styles.cardTitle}>📢 জরুরী রক্তের রিকোয়েস্টসমূহ</h2>
        {requests.length > 0 ? (
          <div style={styles.requestsGrid}>
            {requests.map((req) => (
              <div key={req._id} style={styles.requestCard}>
                <span style={styles.badge}>{req.bloodGroup}</span>
                <h4 style={{ margin: '10px 0 5px 0' }}>রোগী: {req.patientName}</h4>
                <p style={{ margin: '2px 0', fontSize: '13px' }}>🏥 স্থান: {req.donationPlace}</p>
                <p style={{ margin: '2px 0', fontSize: '13px' }}>📅 তারিখ: {req.donationDate}</p>
                <p style={{ margin: '2px 0', fontSize: '13px' }}>📞 যোগাযোগ: {req.contactPhone}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#7f8c8d' }}>বর্তমানে কোনো জরুরি রক্তের রিকোয়েস্ট নেই।</p>
        )}
      </section>
    </div>
  );
}

// ইনলাইন রেসপন্সিভ স্টাইলস
const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh' },
  header: { textAlign: 'center', backgroundColor: '#e74c3c', color: '#fff', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  title: { margin: 0, fontSize: '28px' },
  subtitle: { margin: '5px 0 10px 0', fontSize: '14px', opacity: 0.9 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { borderBottom: '2px solid #e74c3c', paddingBottom: '10px', marginTop: 0, color: '#2c3e50', fontSize: '20px' },
  filterBox: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' },
  selectInput: { padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px', cursor: 'pointer' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' },
  listItem: { padding: '12px', borderLeft: '4px solid #e74c3c', backgroundColor: '#fff5f5', borderRadius: '4px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px' },
  submitBtn: { padding: '12px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  requestsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginTop: '15px' },
  requestCard: { position: 'relative', padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fafafa' },
  badge: { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#e74c3c', color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }
};

export default App;