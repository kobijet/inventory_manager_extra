import React, { useState } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import axios from 'axios';
import InventoryItem from './Inventory/InventoryItem';

const Inventory = () => {
    let data = useLoaderData();

    const [errorMessage, setErrorMessage] = useState('');

    const handleEdit = (e) => {
    }

    const handleDelete = (e) => {
        const config = {
            headers: {
                authorization: localStorage.getItem("accessToken")
            }
        }

        axios.delete('http://localhost:3030/inventory/' + e, config)
        .then((response) =>{
            // Handle success
            if (response.status === 200) {
                console.log(response.data.message);
            }
        })
        .catch((error) => {
            // Handle errors
            console.log(error.response.data.error);
            setErrorMessage(error.response.data.error);
        });
    }

    // Get inventory items and store for display
    let inventoryItems = [];
    if (data !== null) {
        data.map((item) => {
            inventoryItems.push(
                <li id={item.id} key={item.id}>
                    <InventoryItem item={item} />
                </li>
            );
        });
    } else {
        inventoryItems = [];
        inventoryItems.push(<li><p>No inventory to display</p></li>);
    }

    return (
        <div id="inventory-component">
            <Outlet />
            <ul>
                <li><h2>Inventory</h2></li>
                <li>{errorMessage}</li>
                {inventoryItems}
            </ul>
        </div>
    );
}

export default Inventory;
