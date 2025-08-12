import React, { useEffect, useState } from 'react';
import background from '../assets/photo1.jpg';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

function Character() {
    const [characters, setCharacters] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let aborted = false;

        async function fetchAllChars() {
            try {
                let allCharacters = [];
                let nextUrl = BASE_URL;

                while (nextUrl) {
                    const res = await fetch(nextUrl);
                    if (!res.ok) throw new Error(`Failed with status ${res.status}`);

                    const data = await res.json();
                    allCharacters = allCharacters.concat(data.results);
                    nextUrl = data.info.next;

                    if (aborted) break;
                }

                if (!aborted) setCharacters(allCharacters);
            } catch (err) {
                if (!aborted) setError(err.message);
            }

            return () => {
                aborted = true;
            };
        }

        fetchAllChars();
    }, []);

    const handleDelete = (idToDelete) => {
        setCharacters(characters.filter((character) => character.id !== idToDelete));
    };

    const handleCardClick = (id) => {
        setTimeout(() => {
            navigate(`/character/${id}`);
        },2000);
    };

    // Filter characters based on search input
    const filteredCharacters = characters.filter((char) =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

    return (
        <div
           
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className="relative z-10 p-6 text-white">
                <h2 className="font-semibold text-center text-4xl mb-6 italic underline ">
                    Rick and Morty Characters ({filteredCharacters.length})
                </h2>

                {/* Floating Search Bar */}
                <div className="absolute top-6 right-6 z-50 w-64">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 rounded-md bg-white bg-opacity-80 backdrop-blur-md text-black shadow-md outline-none border border-gray-300 focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                </div>


                { }
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {filteredCharacters.map((char) => (
                        <div
                            key={char.id}
                            onClick={() => handleCardClick(char.id)}
                            className="bg-white bg-opacity-90 text-black border-2 rounded-lg p-4 hover:bg-opacity-100 hover:cursor-pointer transition duration-300"
                        >
                            <img
                                src={char.image}
                                alt={char.name}
                                className="rounded-lg mb-2 w-full h-48 object-cover"
                            />
                            <h3 className="text-lg font-semibold mb-2">{char.name}</h3>
                            <button
                                className="bg-red-600 text-white rounded-lg hover:bg-red-800 p-2 w-full"
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleDelete(char.id);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Character;
