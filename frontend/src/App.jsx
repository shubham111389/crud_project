import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialForm = {
  name: "",
  email: "",
  mobile: ""
};

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`);
      const result = await response.json();
      setUsers(Array.isArray(result) ? result : []);
    } catch (error) {
      setMessage("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isEdit = Boolean(editingId);
    const url = isEdit ? `${API_URL}/users/${editingId}` : `${API_URL}/users`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Request failed");
      }

      setMessage(isEdit ? "User updated" : "User created");
      setForm(initialForm);
      setEditingId("");
      fetchUsers();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setForm({
      name: user.name,
      email: user.email,
      mobile: user.mobile
    });
    setMessage("Editing user");
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      setMessage("User deleted");
      if (editingId === id) {
        setEditingId("");
        setForm(initialForm);
      }
      fetchUsers();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleReset = () => {
    setEditingId("");
    setForm(initialForm);
    setMessage("");
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Simple Users CRUD</h1>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
            required
          />

          <div className="actions">
            <button type="submit">{editingId ? "Update" : "Create"}</button>
            <button type="button" onClick={handleReset} className="secondary">
              Reset
            </button>
          </div>
        </form>

        {message ? <p className="message">{message}</p> : null}

        <div className="listHeader">
          <h2>Users List</h2>
          <button onClick={fetchUsers} className="secondary">
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="list">
          {users.length === 0 ? (
            <p>No users found</p>
          ) : (
            users.map((user) => (
              <div key={user._id} className="card">
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                  <p>{user.mobile}</p>
                </div>

                <div className="actions">
                  <button onClick={() => handleEdit(user)} className="secondary">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(user._id)} className="danger">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
