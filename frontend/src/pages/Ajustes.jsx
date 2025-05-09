import React, { useEffect, useState } from "react";

function Ajustes() {
    const [users, setUsers] = useState([]);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error('❌ Error al cargar usuarios:', err));
    }, []);

    const handleEditClick = (user) => {
        setEditId(user.id);
        setFormData({
            username: user.username,
            email: user.email,
            role: user.role
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (id) => {
        fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al actualizar usuario');
                return res.json();
            })
            .then(() => {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, ...formData } : u));
                setEditId(null);
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;
        fetch(`/api/users/${id}`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Error al eliminar usuario');
                setUsers(prev => prev.filter(u => u.id !== id));
            })
            .catch(err => console.error(err));
    };

    const handleAddUser = () => {
        const newUser = {
            username: '',
            email: '',
            role: 'operator',
            password: ''
        };
        fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al crear usuario');
                return res.json();
            })
            .then(newUser => setUsers(prev => [...prev, newUser]))
            .catch(err => console.error(err));
    };

    return (
        <div className="content-container">
            <h1>Cuentas</h1>
            <button onClick={handleAddUser}>+ Añadir usuario</button>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            {editId === user.id ? (
                                <>
                                    <td><input name="username" value={formData.username} onChange={handleInputChange} /></td>
                                    <td><input name="email" value={formData.email} onChange={handleInputChange} /></td>
                                    <td>
                                        <select name="role" value={formData.role} onChange={handleInputChange}>
                                            <option value="admin">Admin</option>
                                            <option value="operator">Operator</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => handleSave(user.id)}>💾 Guardar</button>
                                        <button onClick={() => setEditId(null)}>❌ Cancelar</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(user)}>✏️</button>
                                        <button onClick={() => handleDelete(user.id)}>🗑️</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Ajustes;
