import React from 'react';

const DynamicTable = ({ data }) => {
    return (
        <table border="1" cellPadding="10" style={{ margin: '0 auto' }}>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Record</th>
                </tr>
            </thead>
            <tbody>
                {data.map((record, index) => (
                    <tr key={index}>
                        <td>{record.date}</td>
                        <td>{record.info}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DynamicTable;
