import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

const Profile = () => {
    const userData = useLoaderData();

    return (
        <div id="profile-component">
            <ul>
                <li><h2>User Account</h2></li>
                <li><p>@{userData.username}</p></li>
                <li><p>Name: {userData.name}</p></li>
                <li><p>Email: {userData.email}</p></li>
                <li><p>Role: {userData.role}</p></li>
            </ul>
        </div>
    );
}

export default Profile;
