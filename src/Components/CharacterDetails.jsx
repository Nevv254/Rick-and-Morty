import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CharacterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Show spinner initially

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        if (!res.ok) throw new Error('Failed to fetch character');
        const data = await res.json();
        setCharacter(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-green-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading character details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
      >
        Back
      </button>

      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <img
          src={character.image}
          alt={character.name}
          className="w-full rounded-lg mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{character.name}</h2>
        <p><strong>Status:</strong> {character.status}</p>
        <p><strong>Species:</strong> {character.species}</p>
        <p><strong>Gender:</strong> {character.gender}</p>
        <p><strong>Origin:</strong> {character.origin?.name}</p>
        <p><strong>Location:</strong> {character.location?.name}</p>
      </div>
    </div>
  );
}

export default CharacterDetails;
