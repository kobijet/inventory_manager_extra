import axios from 'axios';

export async function inventoryLoader() {
    const config = {
        headers: {
            authorization: sessionStorage.getItem("accessToken")
        }
    }

    const res = await axios.get("http://localhost:3030/inventory", config);

    const inventory = res.data;

    return inventory;
}
