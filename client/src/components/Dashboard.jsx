import { useLoaderData } from "react-router-dom";
import KPIComponent from "./KPIComponent";
import InventoryAlerts from "./Inventory/InventoryAlerts"

const Dashboard = () => {
    const data = useLoaderData();

    // Calculate total inventory value
    const inventoryValue = () => {
        let runningTotal = 0.00;
        for (let i = 0; i < data.length; i++) {
            runningTotal += data[i].qty * data[i].price.toFixed(2);
        }
        return runningTotal;
    }

    // Calculate value of reserved inventory
    const inventoryReservedValue = () => {
        let runningTotal = 0.00;
        for (let i = 0; i < data.length; i++) {
            runningTotal += data[i].qtyres * data[i].price.toFixed(2);
        }
        return runningTotal;
    }

    // Calculate value of available inventory
    const availableInventoryValue = () => {
        let runningTotal = 0.00;
        for (let i = 0; i < data.length; i++) {
            runningTotal += (data[i].qty - data[i].qtyres) * data[i].price.toFixed(2);
        }
        return runningTotal;
    }

    // Get total # of items in inventory
    const totalInventoryQty = () => {
        let runningTotal = 0;
        for (let i = 0; i < data.length; i++) {
            runningTotal += data[i].qty;
        }

        return runningTotal;
    }

    // Get # available items in inventory
    const totalAvailableInventory = () => {
        let runningTotal = 0;
        for (let i = 0; i < data.length; i++) {
            runningTotal += data[i].qty - data[i].qtyres;
        }

        return runningTotal;
    }

    const totalReservedInventory = () => {
        let runningTotal = 0;
        for (let i = 0; i < data.length; i++) {
            runningTotal += data[i].qtyres;
        }

        return runningTotal;
    }

    // Get # of items out of stock
    const totalOutOfStock = () => {
        let runningTotal = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].qty <= 0) { runningTotal += 1 }
        }
        return runningTotal;
    }

    // Get # of items low stock
    const totalLowStock = () => {
        let runningTotal = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].qtyres >= data[i].qty && data[i].qty > 0) { runningTotal += 1 }
        }
        return runningTotal;
    }

    // Calculate ratio of reserved to available
    const reservedAvailableRatio = () => {
        let totalQtyres = 0;
        let totalQtyAvailable = 0;
        for (let i = 0; i < data.length; i++) {
            totalQtyres += data[i].qtyres;
            totalQtyAvailable += data[i].qty;
        }

        return ((totalQtyres) / (totalQtyAvailable - totalQtyres)) * 100;
    }

    // Calculate days of remaining stock
    const stockCoverage = () => {
        let averageReserved = 0;
        let numItemsReserved = 0;
        let totalQtyAvailable = 0;
        for (let i = 0; i < data.length; i++) {
            // Calculate average reserved items
            if (data[i].qtyres > 0) { 
                numItemsReserved += 1;
                averageReserved += data[i].qtyres;
            }

            // Calculate total available qty of items
            totalQtyAvailable += data[i].qty - data[i].qtyres;
        }

        averageReserved = averageReserved / numItemsReserved;
        return totalQtyAvailable / averageReserved;
    }

    return (
        <div id="dashboard-component">
            <h2>Dashboard</h2>
            <KPIComponent name={"Total Qty On-Hand"} value={String(totalInventoryQty())}/>
            <KPIComponent name={"Total Value"} value={"$" + String(inventoryValue())}/>
            <br />
            <KPIComponent name={"Total Qty Reserved"} value={String(totalReservedInventory())}/>
            <KPIComponent name={"Total Reserved Value"} value={"$" + String(inventoryReservedValue())}/>
            <br />
            <KPIComponent name={"Total Qty Available"} value={String(totalAvailableInventory())}/>
            <KPIComponent name={"Available Inventory Value"} value={"$" + String(availableInventoryValue())}/>
            <br />
            <KPIComponent name={"Reserved vs. Available"} value={String(reservedAvailableRatio())}/>
            <br />
            <KPIComponent name={"Stock Coverage"} value={String(stockCoverage())}/>

            <h2>Stock Alerts</h2>
            <KPIComponent name={"Items Out-Of-Stock"} value={String(totalOutOfStock())}/>
            <KPIComponent name={"Items Low-Stock"} value={String(totalLowStock())}/>
            <InventoryAlerts />
        </div>
    );
}

export default Dashboard;
