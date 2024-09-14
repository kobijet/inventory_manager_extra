import React, { useContext } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import InventoryItem from './InventoryItem';
import './inventory.css';

const InventoryAlerts = () => {
    const data = useLoaderData();

    // Filter out of stock items
    let outOfStockItems = [];
    data
    .filter((item) => {
        if (item.qty <= 0) return item;
    })
    .map((item) => {
        outOfStockItems.push(
            <li className="item" key={item.id}>
                <InventoryItem item={item} />
            </li>
        );
    });

    // Filter items on backorder, that aren't out of stock
    let lowStockItems = [];
    data
    .filter((item) => {
        if (item.qtyres >= item.qty && item.qty > 0) return item;
    })
    .map((item) => {
        lowStockItems.push(
            <li className="item" key={item.id}>
                <InventoryItem item={item} />
            </li>
        );
    });

    return (
        <div id="inventory-alerts-component">
            <ul>
                <li><h2>Inventory Alerts</h2></li>
                <li><h3>Out-Of-Stock</h3></li>
                {outOfStockItems}
                <li><h3>Low Stock</h3></li>
                {lowStockItems}
            </ul>
        </div>
    );
}

export default InventoryAlerts;
