import React, { useState, useEffect } from 'react';
import { AgGridReact } from'ag-grid-react';
import'ag-grid-community/dist/styles/ag-grid.css';
import'ag-grid-community/dist/styles/ag-theme-material.css';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Addcar from './Addcar';
import Editcar from './EditCar';

export default function Carlist() {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  
  useEffect(() => fetchData(), []); 

  const fetchData = () => { 
      fetch('https://carstockrest.herokuapp.com/cars')
      .then(response => response.json())
      .then(data => setCars(data._embedded.cars))

  }

  const deleteCar = (link) => {
    if(window.confirm('Are you sure?')) {
    fetch(link, {method: 'DELETE'})
    .then(res => {
      fetchData()
      setOpen(true)
      setMsg("Car was deleted")
    })
    .catch(err => console.log(err))
    }
  }

  const saveCar = (car) => {
    fetch('https://carstockrest.herokuapp.com/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(car)
    })
    .then(res => {
      fetchData()
      setOpen(true)
      setMsg("New car was added")
    })
    .catch(err => console.error(err))
  }

  const updateCar = (car, link) => {
    fetch(link, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(car)
    })
    .then(res => {
      fetchData()
      setOpen(true)
      setMsg("Car was updated")
    })
    .catch(err => console.error(err))
  } 

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  

  const columns = [
      { headerName: 'Brand', field: "brand", sortable: true, filter: true },
      { headerName: 'Model', field: "model", sortable: true, filter: true },  
      { headerName: 'Color', field: "color", sortable: true, filter: true },
      { headerName: 'Fuel', field: "fuel", sortable: true, filter: true },
      { headerName: 'Year', field: "year", sortable: true, filter: true },
      { headerName: 'Price', field: "price", sortable: true, filter: true },
      { width: 80, cellRenderer:(row) =>
        <Editcar updateCar={updateCar} car={row.data}/> },
      {  headerName: "", field: '_links.self.href', width: 80, cellRenderer:(cell) =>
        <Button size="small" color="secondary" onClick={() => deleteCar(cell.value)}>Delete</Button>}
    ]

  return (
    <div className="ag-theme-material"
          style={{height: '800px', width: '85%', margin: 'auto'}} >
      <Addcar saveCar={saveCar}/>
      <AgGridReact
        columnDefs={columns}
        rowData={cars}>
      </AgGridReact>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={msg}
        action={action}
      />
    </div>
  );
}