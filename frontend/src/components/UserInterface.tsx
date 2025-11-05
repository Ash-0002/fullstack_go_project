import React, { useState, useEffect } from "react";
import axios from "axios";
import CardComponent from "./CardComponent";
import { toast } from "react-toastify";
import { totalmem } from "os";

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
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [updateUser, setUpdateUser] = useState({ id: "", name: "", email: "" });
  const [errors, setErrors] = useState({ name: "", email: "" });
  //Define styles based on the backedn name
  const backgroundColors: { [key: string]: string } = {
    go: "bg-gray-300",
  };

  const buttonColors: { [key: string]: string } = {
    go: "bg-black hover:bg-gray-600 cursonr-pointer",
  };

  const bgColor =
    backgroundColors[backendName as keyof typeof backgroundColors] ||
    "bg-gray-200";
  const btnColor =
    buttonColors[backendName as keyof typeof buttonColors] ||
    "bg-gray-700 hover:bg-gray-600";

  // fetch all users

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/${backendName}/users`);
        setUsers(response.data.reverse());
      } catch (error) {
        toast.error("Failed to fetch users");
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [backendName, apiUrl]);

  // Create a new User

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { name: "", email: "" };

    if (!newUser.name.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    }

    if (!newUser.email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      toast.warn("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/${backendName}/users`,
        newUser
      );
      setUsers([response.data, ...users]);
      setNewUser({ name: "", email: "" });
      toast.success("User created successfully!");
    } catch (error) {
      toast.error("Failed to create user.");
      console.error("Error creating user:", error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/${backendName}/users/${id}`);
      // setUsers(users.filter((user) => user.id !== id));
      await axios.get(`${apiUrl}/api/${backendName}/users`).then((response) => {
        setUsers(response.data.reverse());
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const updatedUser = async (id: number) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/${backendName}/users/${id}`,
        updateUser
      );
      axios.get(`${apiUrl}/api/${backendName}/users`).then((response) => {
        setUsers(response.data.reverse());
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };


  return (
    <div
      className={`user-interface ${bgColor} ${backendName} w-full max-w-md p-4 my-4 rounded shadow`}
    >
      <img
        src={`/${backendName}logo.svg`}
        alt={`${backendName} logo`}
        className="w-20 h-20 mb-6 mx-auto"
      />
      <h2 className="text-xl font-bold text-center text-white mb-2">{`${
        backendName.charAt(0).toUpperCase() + backendName.slice(1)
      } Backend`}</h2>

      {/* create user  */}

      <form
        onSubmit={createUser}
        className="mb-6 p-4 bg-gray-400 rounded shadow text-black"
      >
        <div className="mb-3">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => {
              setNewUser({ ...newUser, name: e.target.value });
              setErrors({ ...errors, name: "" });
            }}
            className={`w-full p-2 border rounded ${
              errors.name ? "border-red-500" : "border-black"
            }`}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => {
              setNewUser({ ...newUser, email: e.target.value });
              setErrors({ ...errors, email: "" });
            }}
            className={`w-full p-2 border rounded ${
              errors.email ? "border-red-500" : "border-black"
            }`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
          
        </div>

        <button className="w-full p-2 text-white bg-black rounded hover:bg-gray-600">
          Add User
        </button>
      </form>

      {/* <form onSubmit={handleUpdateUser} className="mb-6 p-4 bg-gray-500 rounded shadow text-black">
        <input type="text" placeholder="User Id"
        value={updateUser.name}
        onChange={(e)=> setUpdateUser({...updateUser, email: e.target.value })}
        className="mb-2 w-full p-2 border border-black rounded"
        />
        <input type="text" />

        <input type="text" />

        <button>
            Update User
        </button>
      </form> */}

      {/* display users  */}
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex item-center justify-between bg-white p-2 rounded-lg shadow"
          >
            <CardComponent card={user}
                
            />
            <div className="flex flex-col gap-2 justify-center mr-4">
              <button
                onClick={() => deleteUser(user.id)}
                className={`${btnColor} text-white h-8 py-1 text-sm px-2 rounded`}
              >
                Delete User
              </button>
              <button
                onClick={() => updatedUser(user.id)}
                className={`${btnColor} text-white h-8 text-sm py-1 px-2 rounded`}
              >
                Update User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserInterface;
