import React, { useEffect, useState } from 'react';
import api from '../api/axios';

interface Pet {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
}

const PetDashboard = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('Dog');

    // 1. LEER (Read): Traer mascotas del backend
    const fetchPets = async () => {
        try {
            const response = await api.get('/pets/my');
            setPets(response.data);
        } catch (error) {
            console.error("Error al traer mascotas", error);
        }
    };

    useEffect(() => { fetchPets(); }, []);

    // 2. CREAR (Create): Guardar nueva mascota
    const handleAddPet = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/pets/register', { name, species, breed: 'Desconocida', age: 0 });
            setName('');
            fetchPets(); // Refrescamos la lista
        } catch (error) {
            alert("Error al agregar mascota");
        }
    };

    // 3. BORRAR (Delete): Eliminar mascota
    const handleDelete = async (id: string) => {
        if (window.confirm("¿Seguro que quieres borrar a esta mascota?")) {
            try {
                await api.delete(`/pets/${id}`);
                fetchPets();
            } catch (error) {
                alert("No se pudo eliminar");
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>🐾 Mis Mascotas</h1>

            {/* Formulario Simple para Agregar */}
            <form onSubmit={handleAddPet}>
                <input placeholder="Nombre de mascota" value={name} onChange={(e) => setName(e.target.value)} required />
                <select value={species} onChange={(e) => setSpecies(e.target.value)}>
                    <option value="Dog">Perro</option>
                    <option value="Cat">Gato</option>
                </select>
                <button type="submit">Agregar</button>
            </form>

            <hr />

            {/* Lista de Mascotas */}
            <ul>
                {pets.map(pet => (
                    <li key={pet._id} style={{ marginBottom: '10px' }}>
                        {pet.name} ({pet.species})
                        <button onClick={() => handleDelete(pet._id)} style={{ marginLeft: '10px', color: 'red' }}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PetDashboard;
