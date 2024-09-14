import React, { useState, useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import axios from 'axios';
import InventoryItem from './InventoryItem';
import './inventory.css';

const Inventory = () => {
    let data = useLoaderData();

    const [errorMessage, setErrorMessage] = useState('');
    const [inventory, setInventory] = useState();

    let editMode = false;

    const [name, setName] = useState();
    function handleSetName(e) { setName(e); console.log(name); }

    const [category, setCategory] = useState();
    function handleSetCategory(e) { setCategory(e.target.value); }

    const [qty, setQty] = useState();
    function handleSetQty(e) { setQty(e.target.value); }

    const [qtyres, setQtyres] = useState();
    function handleSetQtyres(e) { setQtyres(e.target.value); }

    const [price, setPrice] = useState();
    function handleSetPrice(e) { setPrice(e.target.value); }

    const config = {
        headers: {
            authorization: localStorage.getItem("accessToken")
        }
    }

    const InventoryEditItem = ({item}) => {
        return (
            <>
                <p className="item-id">{item.id}</p>
                <div className="short-field">
                    <p><input type="text" defaultValue={item.name} /></p>
                    <p><input type="text" defaultValue={item.category} /></p>
                </div>
                <div className="short-field">
                    <p><input type="text" defaultValue={item.qtyres} /></p>
                    <p><input type="text" defaultValue={item.qty} /></p>
                </div>
                <p className="short-field">$<input type="number" step="0.01" defaultValue={item.price} />/ea.</p>
            </>
        );
    }

    const renderInventory = () => {
        let inventoryItems = [];
        if (data !== null) {
            data.map((item) => {
                inventoryItems.push(
                    <li className="item" id={item.id} key={item.id}>
                        <InventoryItem item={item} />
                        <button type="button" onClick={() => handleEdit(item.id)}>Edit</button>
                    </li>
                );
            });
        } else {
            inventoryItems = [];
            inventoryItems.push(<li><p>No inventory to display</p></li>);
        }
        return inventoryItems;
    }

    const handleEdit = (id) => {
        editMode = !editMode;

        let inventoryItems = [];
        
        if (editMode === true)
        {
            if (data !== null) {
                data
                .map((item) => {
                    if (item.id === id) {
                        inventoryItems.push(
                            <li id={item.id} key={item.id} className="item">
                                <InventoryEditItem item={item}/>
                                <button type="button" onClick={() => handleEdit(item.id)}>Done</button>
                            </li>
                        );
                        return;
                    }

                    inventoryItems.push(
                        <li className="item" id={item.id} key={item.id}>
                            <InventoryItem item={item} />
                            <button type="button" onClick={() => handleEdit(item.id)}>Edit</button>
                        </li>
                    );
                });
            }
        } else {
            axios.patch('http://localhost:3030/inventory/' + id, {
                name: name,
                category: category,
                qty: qty,
                qtyres: qtyres,
                price: price
            }, config)
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

            inventoryItems = renderInventory();
        }

        setInventory(inventoryItems);
    }

    const handleDelete = (e) => {
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

    // Display inventory on first load
    // Get inventory items and store in state for display
    useEffect( () => {
        setInventory(renderInventory());
    }, []);

    return (
        <div id="inventory-component">
            <Outlet />
            <ul>
                <li><h2>Inventory</h2></li>
                <li>{errorMessage}</li>
                {inventory}
            </ul>
        </div>
    );
}

export default Inventory;
