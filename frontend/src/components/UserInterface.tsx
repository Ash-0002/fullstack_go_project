import React, { useState, useEffect } from "react";
import axios from "axios";
import CardComponent from "./CardComponent";

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserInterfaceProps {
    backendName: string; // go0000
}

const UserInterface: React.FC<UserInterfaceProps> = ({ backendName }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({name: '', email: ""});
    const [updateUser, setUpdateUser] = useState({id: '', name: '', email: ''});
    //Define styles based on the backedn name 
    const backgroundColors : { [key: string]: string } = {
        go: 'bg-gray-300'
    }
    
    const buttonColors: { [key: string]: string } = {  
        go: 'bg-black hover:bg-gray-600 cursonr-pointer'
    }
    
    const bgColor = backgroundColors[backendName as keyof typeof backgroundColors] || 'bg-gray-200';
    const btnColor = buttonColors[backendName as keyof typeof buttonColors] || 'bg-gray-700 hover:bg-gray-600';
    
    // fetch all users
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/${backendName}/users`);
                setUsers(response.data.reverse());
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();       
    },[backendName, apiUrl]);

    // Create a new User 


    const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{
            const response = await axios.post(`${apiUrl}/api/${backendName}/users`, newUser);
            setUsers([response.data, ...users]);
            setNewUser({name: '', email: ''});
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }


    const  deleteUser = async (id: number) => {
        try {
            await axios.delete(`${apiUrl}/api/${backendName}/users/${id}`);
            // setUsers(users.filter((user) => user.id !== id));
            await axios.get(`${apiUrl}/api/${backendName}/users`).then((response) => {
                setUsers(response.data.reverse());
            });
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }

    const updatedUser = async ({id}: {id: number}) => {
        try {
            const response = await axios.put(`${apiUrl}/api/${backendName}/users/${id}`, updateUser);
            axios.get(`${apiUrl}/api/${backendName}/users`).then((response) => {
                setUsers(response.data.reverse());
            });
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }


    return (
        <div className={`user-interface ${bgColor} ${backendName} w-full max-w-md p-4 my-4 rounded shadow`}>
            <img src={`/${backendName}logo.svg`} alt={`${backendName} logo`} className="w-20 h-20 mb-6 mx-auto" />
            <h2 className="text-xl font-bold text-center text-white mb-2">{`${backendName.charAt(0).toUpperCase() + backendName.slice(1)} Backend`}</h2>

        {/* create user  */}

        <form onSubmit={createUser} className="mb-6 p-4 bg-gray-400 rounded shadow text-black">
            <input type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value})}
                className="mb-2 w-full p-2 border border-t-black rounded"
            />
            <input type="text"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value})}
                className="mb-2 w-full p-2 border border-t-black rounded"
            />
            <button className="w-full p-2 text-white bg-black rounded hover:bg-gray-600">
                Add User
            </button>
        </form>




           {/* display users  */}
            <div className="space-y-4">
                {users.map((user) => (
                    <div key={user.id} className="flex item-center justify-between bg-white p-2 rounded-lg shadow">
                        <CardComponent card={user} />
                        <div className="flex flex-col gap-2 justify-center mr-4">
                        <button onClick={() => deleteUser(user.id)} className={`${btnColor} text-white h-8 py-1 text-sm px-2 rounded`}>
                            Delete User
                        </button>
                        <button onClick={() => updatedUser(user.id)} className={`${btnColor} text-white h-8 text-sm py-1 px-2 rounded`}>
                            Update User
                        </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

 
export default UserInterface;

 