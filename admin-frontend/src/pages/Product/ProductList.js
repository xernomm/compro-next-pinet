import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../api/apiService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productAPI.getAll();
            setProducts(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productAPI.delete(id);
                toast.success('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product');
            }
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Products</h2>
                <button onClick={() => navigate('/dashboard/products/new')} className="btn btn-primary">
                    + Add New Product
                </button>
            </div>

            {products.length === 0 ? (
                <div className="content-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <h3>No Products Yet</h3>
                        <p>Add your first product</p>
                        <button onClick={() => navigate('/dashboard/products/new')} className="btn btn-primary" style={{ marginTop: '15px' }}>
                            Add First Product
                        </button>
                    </div>
                </div>
            ) : (
                <div className="content-card table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Order</th>
                                <th>Featured</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        {product.image_url && (
                                            <img src={getImageUrl(product.image_url)} alt={product.name} style={{ height: '40px', width: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        )}
                                    </td>
                                    <td><strong>{product.name}</strong></td>
                                    <td>{product.category}</td>
                                    <td>{product.order_number}</td>
                                    <td>
                                        {product.is_featured && <span className="status-badge status-active">Featured</span>}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${product.is_active ? 'status-active' : 'status-inactive'}`}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button onClick={() => navigate(`/dashboard/products/${product.id}/edit`)} className="btn btn-sm btn-secondary mr-2">Edit</button>
                                        <button onClick={() => handleDelete(product.id)} className="btn btn-sm btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductList;
