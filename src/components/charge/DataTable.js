import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from '@mui/material';
import { styled } from 'styled-components';

const cellStyle = {
    borderRight: '1px solid rgba(224, 224, 224, 1)', // This adds the vertical line
};

const StyledButton = styled('button')({
    backgroundColor: '#f7f7f7',
    color: 'black',
    border: 'none',
    width: '100px',
    height: '50px',
    cursor: 'pointer',
    transition: '0.3s',
    borderRadius: '5px',
    '&:hover': {
        backgroundColor: '#ff9238',
        color: 'white',
    }
});

const tableData = [
    ['1', '1000', '6', '6000'],
    ['2', '2000', '7', '7000'],
    ['3', '3000', '8', '8000'],
    ['4', '4000', '9', '9000'],
    ['5', '5000', '10', '10000'],
    // ... add more rows as you need
];

const DataTable = () => {
    return (
        <Paper style={{ overflowX: 'auto', marginTop: '150px' }}>
            <Table>
                {/* Table Header */}
                <TableHead>
                    <TableRow>
                        {['곶감 수', '가격', '곶감 수', '가격'].map((header, index) => (
                            <TableCell key={index} align="center" style={index !== 3 ? cellStyle : null}>
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                    {tableData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {row.map((cellData, colIndex) => (
                                <TableCell key={colIndex} align="center" style={colIndex !== 3 ? cellStyle : null}>
                                    {(colIndex === 0 || colIndex === 2) ? (
                                        <StyledButton onClick={() => {
                                            console.log(cellData);
                                        }}>
                                            {cellData}
                                        </StyledButton>
                                    ) : cellData}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default DataTable;