'use client';

import axios from 'axios';
import Link from "next/link";
import { useEffect, useState } from 'react';
import useAuthStore from '../../../utility/store';

interface Category {
  _id: string;
  title: string;
}

interface Item {
  _id?: string; // Optional for updates
  title: string;
  price: string;
  categoryId: string;
}

const Admin: React.FC = () => {
  const { user, token, setUser, setToken, clearUser } = useAuthStore();
  const [newCategory, setNewCategory] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [newItems, setNewItems] = useState<Item[]>([{ title: '', price: '', categoryId: '' }]);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [bulkEditItems, setBulkEditItems] = useState<Item[]>([]);
  const [singleCategory, setSingleCategory] = useState<string>('');

  useEffect(() => {
    if (token) {
      const fetchCategories = async () => {
        try {
          const response = await axios.get('/api/categories', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCategories(response.data);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };

      const fetchItems = async () => {
        try {
          const response = await axios.get('/api/items', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBulkEditItems(response.data); // Initialize bulk edit items
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      };

      fetchCategories();
      fetchItems();
    }
  }, [token]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth', { email, password });
      setToken(response.data.token);
      setUser({ email });
      setLoginError(null);
    } catch (error: any) {
      setLoginError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  const handleLogout = () => {
    clearUser();
  };

  const addCategory = async () => {
    try {
      await axios.post('/api/categories', { title: newCategory }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewCategory('');
      const response = await axios.get('/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await axios.delete('/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: categoryId },
      });
      setCategories(categories.filter(cat => cat._id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const updateCategory = async (categoryId: string, newTitle: string) => {
    try {
      await axios.put('/api/categories', { id: categoryId, title: newTitle }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedCategories = categories.map(cat =>
        cat._id === categoryId ? { ...cat, title: newTitle } : cat
      );
      setCategories(updatedCategories);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const addItems = async () => {
    try {
      if (singleCategory) {
        // Assign the same category to all new items
        const itemsWithCategory = newItems.map(item => ({
          ...item,
          categoryId: singleCategory
        }));
        await axios.post('/api/items/bulk', itemsWithCategory, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/items/bulk', newItems, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setNewItems([{ title: '', price: '', categoryId: '' }]); // Reset form
      const response = await axios.get('/api/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBulkEditItems(response.data); // Update bulk edit items
    } catch (error) {
      console.error('Error adding items:', error);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await axios.delete('/api/items', {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: itemId },
      });
      setBulkEditItems(bulkEditItems.filter(item => item._id !== itemId)); // Update bulk edit items
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const updateItem = async (itemId: string, updatedItem: Item) => {
    try {
      await axios.put('/api/items', { id: itemId, ...updatedItem }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedItems = bulkEditItems.map(item =>
        item._id === itemId ? { ...item, ...updatedItem } : item
      );
      setBulkEditItems(updatedItems);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleAddItemField = () => {
    setNewItems([...newItems, { title: '', price: '', categoryId: '' }]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...newItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewItems(updatedItems);
  };

  const handleRemoveLastItemField = () => {
    if (newItems.length > 1) {
      setNewItems(newItems.slice(0, -1));
    }
  };
  if (!user) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <div className="space-y-4">
          <input
            className="border p-2 w-full rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border p-2 w-full rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={handleLogin}
          >
            Sign in
          </button>
          {loginError && <p className="text-red-500">{loginError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <button
        className="bg-red-500 text-white p-2 rounded mb-6 hover:bg-red-600"
        onClick={handleLogout}
      >
        Sign out
      </button>
      <Link href="/admin/reservations">
          <span className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ml-4">
            Go to Reservations
          </span>
        </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add Category</h2>
        <div className="flex items-center mb-4">
          <input
            className="border p-2 mr-2 w-full rounded"
            type="text"
            placeholder="Category Title"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            onClick={addCategory}
          >
            Add
          </button>
        </div>

        <ul className="list-disc pl-5">
          {categories.map(cat => (
            <li key={cat._id} className="mb-2 flex items-center">
              {editingCategory && editingCategory._id === cat._id ? (
                <div className="flex items-center">
                  <input
                    className="border p-2 mr-2 rounded"
                    type="text"
                    value={editingCategory.title}
                    onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                  />
                  <button
                    className="bg-green-500 text-white p-1 rounded mr-2 hover:bg-green-600"
                    onClick={() => updateCategory(cat._id, editingCategory.title)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
                    onClick={() => setEditingCategory(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2">{cat.title}</span>
                  <button
                    className="bg-blue-500 text-white p-1 rounded mr-2 hover:bg-blue-600"
                    onClick={() => setEditingCategory(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    onClick={() => deleteCategory(cat._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add Items</h2>
        <div className="mb-4">
          <label htmlFor="singleCategory" className="block mb-2 font-medium">Choose a single category for all items (optional):</label>
          <select
            id="singleCategory"
            className="border p-2 rounded w-full"
            value={singleCategory}
            onChange={(e) => setSingleCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.title}</option>
            ))}
          </select>
        </div>
        {newItems.map((item, index) => (
          <div key={index} className="mb-4 border p-4 rounded">
            <input
              className="border p-2 mr-2 w-full rounded mb-2"
              type="text"
              placeholder="Item Title"
              value={item.title}
              onChange={(e) => handleItemChange(index, 'title', e.target.value)}
            />
            <input
              className="border p-2 mr-2 w-full rounded mb-2"
              type="text"
              placeholder="Item Price"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
            />
            {!singleCategory && (
              <select
                className="border p-2 rounded w-full mb-2"
                value={item.categoryId}
                onChange={(e) => handleItemChange(index, 'categoryId', e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.title}</option>
                ))}
              </select>
            )}
          </div>
        ))}
        <div className="flex items-center mb-4">
          <button
            className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600"
            onClick={handleAddItemField}
          >
            Add another item
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 mr-3"
            onClick={handleRemoveLastItemField}
          >
            Remove last item
          </button>
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            onClick={addItems}
          >
            Save Items
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Items</h2>
        <ul className="list-disc pl-5">
          {bulkEditItems.map(item => (
            <li key={item._id} className="mb-2 flex items-center">
              {editingItem && editingItem._id === item._id ? (
                <div className="flex items-center">
                  <input
                    className="border p-2 mr-2 rounded"
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  />
                  <input
                    className="border p-2 mr-2 rounded"
                    type="text"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                  />
                  <select
                    className="border p-2 rounded mr-2"
                    value={editingItem.categoryId}
                    onChange={(e) => setEditingItem({ ...editingItem, categoryId: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.title}</option>
                    ))}
                  </select>
                  <button
                    className="bg-green-500 text-white p-1 rounded mr-2 hover:bg-green-600"
                    onClick={() => updateItem(item._id!, editingItem)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
                    onClick={() => setEditingItem(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2">{item.title} - SAR{item.price}</span>
                  <button
                    className="bg-blue-500 text-white p-1 rounded mr-2 hover:bg-blue-600"
                    onClick={() => setEditingItem(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    onClick={() => deleteItem(item._id!)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
