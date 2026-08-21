import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ✅ Render ব্যাকএন্ডের সঠিক URL
const API_BASE_URL = 'https://blood-donation-backend-rscs.onrender.com/api';

function App() {
  const [selectedGroup, setSelectedGroup] = useState('A+');
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // ডোনারদের তালিকা ফেচ করা
  const fetchDonors = async (group) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/donors?group=${encodeURIComponent(group)}`);
      setDonors(response.data);
    } catch (error) {
      console.error('Donors fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // রক্তের রিকোয়েস্টগুলোর তালিকা ফেচ করা
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/requests`);
      setRequests(response.data);
    } catch (error) {
      console.error('Requests fetch error:', error);
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
      
      // ফর্ম রিসেট
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
      
      fetchRequests(); // নতুন ডাটা রিফ্রেশ
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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>যুবশক্তি রক্তদান সেবা (Juboshokti Blood Donation)</h1>

      {/* রক্তের ডোনার সার্চ সেকশন */}
      <section style={{ marginBottom: '30px' }}>
        <h2>ডোনার খুঁজুন</h2>
        <label>রক্তের গ্রুপ নির্বাচন করুন: </label>
        <select 
          value={selectedGroup} 
          onChange={(e) => setSelectedGroup(e.target.value)}
          style={{ padding: '5px 10px', marginLeft: '10px' }}
        >
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>

        <div style={{ marginTop: '15px' }}>
          {loading ? (
            <p>ডোনার ডাটা লোড হচ্ছে...</p>
          ) : donors.length > 0 ? (
            <ul>
              {donors.map((donor) => (
                <li key={donor._id || donor.phone}>
                  <strong>{donor.name}</strong> - গ্রুপ: {donor.bloodGroup} | ঠিকানা: {donor.address} | ফোন: {donor.phone}
                </li>
              ))}
            </ul>
          ) : (
            <p>এই গ্রুপের কোনো ডোনার পাওয়া যায়নি।</p>
          )}
        </div>
      </section>

      <hr />

      {/* রক্তের আবেদন করার ফর্ম */}
      <section style={{ marginTop: '30px', marginBottom: '30px' }}>
        <h2>রক্তের আবেদন করুন</h2>
        <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', gap: '10px' }}>
          <input 
            type="text" 
            name="patientName" 
            placeholder="রোগীর নাম" 
            value={requestForm.patientName} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="text" 
            name="problem" 
            placeholder="রোগীর সমস্যা" 
            value={requestForm.problem} 
            onChange={handleInputChange} 
          />
          <select name="bloodGroup" value={requestForm.bloodGroup} onChange={handleInputChange}>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          <input 
            type="text" 
            name="hemoglobin" 
            placeholder="হিমোগ্লোবিন (যদি থাকে)" 
            value={requestForm.hemoglobin} 
            onChange={handleInputChange} 
          />
          <input 
            type="text" 
            name="units" 
            placeholder="কত ব্যাগ রক্ত প্রয়োজন" 
            value={requestForm.units} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="text" 
            name="donationDate" 
            placeholder="রক্তদানের তারিখ/সময়" 
            value={requestForm.donationDate} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="text" 
            name="donationPlace" 
            placeholder="হাসপাতাল / স্থান" 
            value={requestForm.donationPlace} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="text" 
            name="contactPhone" 
            placeholder="যোগাযোগের নম্বর" 
            value={requestForm.contactPhone} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="text" 
            name="reference" 
            placeholder="রেফারেন্স (ঐচ্ছিক)" 
            value={requestForm.reference} 
            onChange={handleInputChange} 
          />
          <button type="submit" style={{ padding: '10px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer' }}>
            আবেদন জমা দিন
          </button>
        </form>
      </section>

      <hr />

      {/* রক্তের সাম্প্রতিক আবেদনের তালিকা */}
      <section style={{ marginTop: '30px' }}>
        <h2>জরুরী রক্তের রিকোয়েস্টসমূহ</h2>
        {requests.length > 0 ? (
          <ul>
            {requests.map((req) => (
              <li key={req._id} style={{ marginBottom: '10px' }}>
                <strong>রোগী: {req.patientName}</strong> ({req.bloodGroup}) - স্থান: {req.donationPlace} | তারিখ: {req.donationDate} | যোগাযোগ: {req.contactPhone}
              </li>
            ))}
          </ul>
        ) : (
          <p>বর্তমানে কোনো রক্তের রিকোয়েস্ট নেই।</p>
        )}
      </section>
    </div>
  );
}

export default App;