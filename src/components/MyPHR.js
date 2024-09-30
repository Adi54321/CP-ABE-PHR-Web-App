import React, { useState } from 'react';

const MyPHR = () => {
    const [record, setRecord] = useState('');
    const [response, setResponse] = useState(null);
    const [attributes, setAttributes] = useState('');  // Comma-separated attributes

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            record: record,  // This is the health record data
            userAttributes: attributes.split(','),  // Convert comma-separated attributes to an array
        };

        // Send PHR data to the backend for encryption using CP-ABE
        try {
            const res = await fetch('http://localhost:5000/api/encrypt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            setResponse(result.encryptedData);  // Backend should return the encrypted data
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Submit Personal Health Record (PHR)</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={record}
                    onChange={(e) => setRecord(e.target.value)}
                    placeholder="Enter your health record"
                /><br /><br />
                <input 
                    type="text"
                    value={attributes}
                    onChange={(e) => setAttributes(e.target.value)}
                    placeholder="Enter attributes (e.g., doctor,nurse)"
                /><br /><br />
                <button type="submit">Encrypt & Submit</button>
            </form>

            {response && (
                <div>
                    <h3>Encrypted Data:</h3>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default MyPHR;
