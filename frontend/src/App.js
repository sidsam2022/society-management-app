import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [residents, setResidents] = useState([]);
  const [newResident, setNewResident] = useState({ name: '', flat_no: '', phone: '', email: '' });
  const [editingResident, setEditingResident] = useState(null);
  const [message, setMessage] = useState(null);   // success/error feedback

  // Fetch residents
  useEffect(() => {
    axios.get('/api/residents')
      .then(res => setResidents(res.data))
      .catch(err => console.error(err));
  }, []);

  // Add new resident
  const handleAdd = () => {
    axios.post('/api/residents', newResident)
      .then(() => axios.get('/api/residents'))
      .then(res => {
        setResidents(res.data);
        setMessage({ type: 'success', text: 'Resident registered successfully!' });
        setNewResident({ name: '', flat_no: '', phone: '', email: '' });
      })
      .catch(() => setMessage({ type: 'danger', text: 'Failed to add resident. Please try again.' }));
  };

  // Delete resident
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this resident?")) {
      axios.delete(`/api/residents/${id}`)
        .then(() => axios.get('/api/residents'))
        .then(res => {
          setResidents(res.data);
          setMessage({ type: 'success', text: 'Resident deleted successfully!' });
        })
        .catch(() => setMessage({ type: 'danger', text: 'Failed to delete resident.' }));
    }
  };

  // Start editing
  const handleEdit = (resident) => {
    setEditingResident(resident);
  };

  // Save edited resident
  const handleUpdate = () => {
    axios.put(`/api/residents/${editingResident.id}`, editingResident)
      .then(() => axios.get('/api/residents'))
      .then(res => {
        setResidents(res.data);
        setEditingResident(null);
        setMessage({ type: 'success', text: 'Resident updated successfully!' });
      })
      .catch(() => setMessage({ type: 'danger', text: 'Failed to update resident.' }));
  };

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-dark bg-primary mb-4">
        <span className="navbar-brand mb-0 h1">Society Management App</span>
      </nav>

      {message && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      <h2 className="text-secondary">Current Residents Directory</h2>
      <div className="row">
        {residents.map(r => (
          <div className="col-md-4" key={r.id}>
            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{r.name}</h5>
                <p className="card-text">Flat: {r.flat_no}</p>
                <p className="card-text">Phone: {r.phone}</p>
                <p className="card-text">Email: {r.email}</p>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(r)}>✏️ Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-4">Add New Resident</h2>
      <form>
        <input className="form-control mb-2" placeholder="Name" value={newResident.name}
               onChange={e => setNewResident({...newResident, name: e.target.value})}/>
        <input className="form-control mb-2" placeholder="Flat No" value={newResident.flat_no}
               onChange={e => setNewResident({...newResident, flat_no: e.target.value})}/>
        <input className="form-control mb-2" placeholder="Phone" value={newResident.phone}
               onChange={e => setNewResident({...newResident, phone: e.target.value})}/>
        <input className="form-control mb-2" placeholder="Email" value={newResident.email}
               onChange={e => setNewResident({...newResident, email: e.target.value})}/>
        <button type="button" className="btn btn-success mt-2" onClick={handleAdd}>Add Resident</button>
      </form>

      {editingResident && (
        <div className="mt-4">
          <h2>Edit Resident</h2>
          <input className="form-control mb-2" value={editingResident.name}
                 onChange={e => setEditingResident({...editingResident, name: e.target.value})}/>
          <input className="form-control mb-2" value={editingResident.flat_no}
                 onChange={e => setEditingResident({...editingResident, flat_no: e.target.value})}/>
          <input className="form-control mb-2" value={editingResident.phone}
                 onChange={e => setEditingResident({...editingResident, phone: e.target.value})}/>
          <input className="form-control mb-2" value={editingResident.email}
                 onChange={e => setEditingResident({...editingResident, email: e.target.value})}/>
          <button type="button" className="btn btn-primary mt-2 me-2" onClick={handleUpdate}>Save</button>
          <button type="button" className="btn btn-secondary mt-2" onClick={() => setEditingResident(null)}>Cancel</button>
        </div>
      )}

      <footer className="mt-5 text-muted text-center">
        Society Management App © 2026
      </footer>
    </div>
  );
}

export default App;

