import React, { useState, useEffect } from 'react';
import { Outlet, useLoaderData, useRevalidator } from 'react-router-dom';
import axios from 'axios';
import InventoryItem from './InventoryItem';
import './inventory.css';

const Inventory = () => {
    let data = useLoaderData();

    const revalidator = useRevalidator();

    const [errorMessage, setErrorMessage] = useState('');
    const [inventory, setInventory] = useState();

    let name = "";
    const setName = (itemName) => {
        name = String(itemName);
    }
    let category = "";
    const setCategory = (itemCategory) => {
        category = String(itemCategory);
    }
    let qtyres = -1;
    const setQtyres = (itemQtyres) => {
        qtyres = parseInt(itemQtyres);
    }
    let qty = -1;
    const setQty = (itemQty) => {
        qty = parseInt(itemQty);
    }
    let price = -1.0;
    const setPrice = (itemPrice) => {
        price = parseFloat(itemPrice);
    }

    const InventoryEditItem = ({ item }) => {
        
        // Set initial values
        setName(item.name);
        setCategory(item.category);
        setQtyres(item.qtyres);
        setQty(item.qty);
        setPrice(item.price);

        return (
            <>
                <p className="item-id">{item.id}</p>
                <div className="short-field">
                    <p>
                        <input type="text" defaultValue={String(item.name)} onChange={(element) => setName(element.target.value)}/>
                    </p>
                    <p>
                        <input type="text" defaultValue={String(item.category)} onChange={(element) => setCategory(element.target.value)}/>
                    </p>
                </div>
                <div className="short-field">
                    <p>
                        Res: 
                        <input type="text" defaultValue={item.qtyres} onChange={(element) => setQtyres(element.target.value)}/>
                    </p>
                    <p>
                        Qty: 
                        <input type="text" defaultValue={item.qty} onChange={(element) => setQty(element.target.value)}/>
                    </p>
                </div>
                <p>
                    $<input type="number" step="0.01" defaultValue={String(item.price)} onChange={(element) => setPrice(element.target.value)}/>/ea.
                </p>
                <button type="button" onClick={() => handleDelete(item.id)}>Delete</button>
            </>
        );
    }

    let editMode = false;

    const config = {
        headers: {
            authorization: localStorage.getItem("accessToken")
        }
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

                // When editMode is enabled:
                // Render inventory,
                // Replace the list item with corresponding id with an edit field
                // Render other inventory items
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
                        </li>
                    );
                });
            }

            setInventory(inventoryItems);
        } else {
            // When edit mode is disabled:
            // Patch inventory item with id with data,
            // Re-render inventory
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

            // Re-render inventory when enabling edit mode,
            // Refresh page to update inventory edits
            window.location.reload();
        }

        
    }

    const handleDelete = (id) => {
        axios.delete('http://localhost:3030/inventory/' + id, config)
        .then((response) =>{
            // Handle success
            if (response.status === 200) {
                console.log(response.data.message);
                window.location.reload();
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
