import axios from 'axios';

export const userLoader = async ({params}) => {
    const { userId } = params;

    const config = {
        headers: {
            authorization: localStorage.getItem("accessToken")
        }
    }

    const res = await axios.get("http://localhost:3030/users/" + userId, config);

    const user = res.data;

    return user[0];
}
