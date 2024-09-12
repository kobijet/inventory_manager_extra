import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewItem = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [qty, setQty] = useState(0);
    const [price, setPrice] = useState(0.0);
    const [errorMessage, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const config = {
            headers: {
                authorization: localStorage.getItem("accessToken")
            }
        }

        axios.post('http://localhost:3030/inventory', {
            name: name,
            category: category,
            qty: qty,
            price: price
        }, config)
        .then((response) =>{
            // Handle success
            if (response.status === 200) {
                window.location.reload();
            }
        })
        .catch((error) => {
            // Handle errors
            console.log(error.response.data.error);
            setError(error.response.data.error);
        });
    }

    return (
        <div id="new-item-component">
            <h2>New Item</h2>
            <p>Fill out the form below to create a new item.</p>
            <p>{errorMessage}</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <label htmlFor="name">Item Name:</label>
                        <input id="name" type="text" maxLength={50} onChange={(element) => setName(element.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="category">Category:</label>
                        <input id="category" type="text" maxLength={50} onChange={(element) => setCategory(element.target.value)}/>
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="qty">QTY:</label>
                        <input id="qty" type="number" onChange={(element) => setQty(Number(element.target.value))}/>
                    </div>
                    <div>
                        <label htmlFor="qty">Price:</label>
                        <input id="qty" type="number" step="0.01" onChange={(element) => setPrice(Number(element.target.value))}/>
                    </div>
                </div>
                <input type="submit" value="Add Item"/>
            </form>
        </div>
    );
}

export default NewItem;
