import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [residents, setResidents] = useState([]);
  const [newResident, setNewResident] = useState({ name: '', flat_no: '', phone: '', email: '' });
  const [editingResident, setEditingResident] = useState(null);
  const [message, setMessage] = useState(null);

  const showNotification = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchResidents = () => {
    axios.get('/api/residents')
      .then(res => setResidents(res.data))
      .catch(err => {
        console.error('Error fetching residents:', err);
        showNotification('danger', 'Failed to fetch residents from backend.');
      });
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newResident.name || !newResident.flat_no || !newResident.phone || !newResident.email) {
      showNotification('danger', 'Please fill in all fields before submitting.');
      return;
    }

    axios.post('/api/residents', newResident)
      .then(() => {
        fetchResidents();
        showNotification('success', 'Resident registered successfully!');
        setNewResident({ name: '', flat_no: '', phone: '', email: '' });
      })
      .catch(err => {
        console.error('Error adding resident:', err);
        showNotification('danger', 'Failed to add resident.');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this resident?")) {
      axios.delete(`/api/residents/${id}`)
        .then(() => {
          fetchResidents();
          showNotification('success', 'Resident deleted successfully!');
        })
        .catch(err => {
          console.error('Error deleting resident:', err);
          showNotification('danger', 'Failed to delete resident.');
        });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`/api/residents/${editingResident.id}`, editingResident)
      .then(() => {
        fetchResidents();
        setEditingResident(null);
        showNotification('success', 'Resident updated successfully!');
      })
      .catch(err => {
        console.error('Error updating resident:', err);
        showNotification('danger', 'Failed to update resident.');
      });
  };

  return (
    <div className="container mt-4 mb-5">
      <nav className="navbar navbar-dark bg-primary mb-4 rounded px-3 shadow-sm">
        <span className="navbar-brand mb-0 h1">🏢 Society Management System</span>
      </nav>

      {message && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage(null)} aria-label="Close"></button>
        </div>
      )}

      <h3 className="text-secondary mb-3">Residents Directory</h3>
      <div className="row">
        {residents.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">No residents found in database.</div>
          </div>
        ) : (
          residents.map(r => (
            <div className="col-md-4 mb-3" key={r.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary">{r.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Flat: {r.flat_no}</h6>
                  <p className="card-text mb-1">📞 {r.phone}</p>
                  <p className="card-text mb-3">✉️ {r.email}</p>
                  <button className="btn btn-outline-warning btn-sm me-2" onClick={() => setEditingResident(r)}>✏️ Edit</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(r.id)}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <hr className="my-4" />

      <div className="row">
        <div className="col-md-6 mb-4">
          <h4>Register New Resident</h4>
          <form onSubmit={handleAdd} className="card p-3 shadow-sm">
            <input className="form-control mb-2" placeholder="Full Name" value={newResident.name}
                   onChange={e => setNewResident({ ...newResident, name: e.target.value })} required />
            <input className="form-control mb-2" placeholder="Flat Number (e.g. A101)" value={newResident.flat_no}
                   onChange={e => setNewResident({ ...newResident, flat_no: e.target.value })} required />
            <input className="form-control mb-2" placeholder="Phone Number" value={newResident.phone}
                   onChange={e => setNewResident({ ...newResident, phone: e.target.value })} required />
            <input className="form-control mb-2" placeholder="Email Address" type="email" value={newResident.email}
                   onChange={e => setNewResident({ ...newResident, email: e.target.value })} required />
            <button type="submit" className="btn btn-success mt-2">Add Resident</button>
          </form>
        </div>

        {editingResident && (
          <div className="col-md-6 mb-4">
            <h4>Edit Resident Info</h4>
            <form onSubmit={handleUpdate} className="card p-3 shadow-sm border-warning">
              <input className="form-control mb-2" value={editingResident.name}
                     onChange={e => setEditingResident({ ...editingResident, name: e.target.value })} required />
              <input className="form-control mb-2" value={editingResident.flat_no}
                     onChange={e => setEditingResident({ ...editingResident, flat_no: e.target.value })} required />
              <input className="form-control mb-2" value={editingResident.phone}
                     onChange={e => setEditingResident({ ...editingResident, phone: e.target.value })} required />
              <input className="form-control mb-2" value={editingResident.email} type="email"
                     onChange={e => setEditingResident({ ...editingResident, email: e.target.value })} required />
              <div>
                <button type="submit" className="btn btn-primary me-2">Save Changes</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingResident(null)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>

      <footer className="mt-5 text-muted text-center border-top pt-3">
        Society Management App © 2026
      </footer>
    </div>
  );
}

export default App;
