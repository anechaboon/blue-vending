'use client';

import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getProducts, deleteProduct, createProduct, updateProduct } from '@/services/product';
import CommonModal from '@/app/components/CommonModal';
import EditProductModalComp from '@/app/components/EditProductModalComp';
import Swal from 'sweetalert2';
import { Product } from '@/app/interface/Product';


export default function ProductsAdminPage() {
  const [data, setData] = useState<Product[]>([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const products = await getProducts();
      setData(products);
    };
    fetchData();
  }, []);

  const handleEdit = (row: Product) => {
    setSelectedProduct(row);
    setOpenEditModal(true);
  };

  const handleDelete = (row: Product) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete product "${row.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteProduct(row.id);
          if (!res.status) {
            Swal.fire('Error', 'Failed to delete product', 'error');
            return;
          }

          Swal.fire('Deleted!', 'Product has been deleted.', 'success').then(() => {
            // Refresh data
            getProducts().then((products) => setData(products));
          });
        } catch (err) {
          console.log('Error:', err);
        }
      }
    });
  };

  async function handleSaveProduct() {
    if (!selectedProduct) return;

    try {
      const formData = new FormData();
      formData.append('title', selectedProduct.title);
      formData.append('price', selectedProduct.price);
      formData.append('stock', selectedProduct.stock);
      if (selectedProduct.image instanceof File) {
        formData.append('image', selectedProduct.image);
      }

      let res, msgSuccess, msgError;

      if( selectedProduct.id === '') {
        // New product
        res = await createProduct(formData);
        msgSuccess = 'Product created successfully';
        msgError = 'Failed to create product';
        
      }else{
        // Update existing product
        res = await updateProduct(selectedProduct.id, formData);
        msgSuccess = 'Product updated successfully';
        msgError = 'Failed to update product';
        
      }
      if (!res.status) {
        Swal.fire('Error', msgError, 'error');
        return;
      }
      Swal.fire('Success', msgSuccess, 'success').then(() => {
        // Refresh data
        getProducts().then((products) => setData(products));
      });

      setOpenEditModal(false);

    } catch (err) {
      console.log('Error:', err);
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'stock', headerName: 'Stock', width: 120 },
    { field: 'price', headerName: 'Price', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      sortable: false,
      filterable: false,
      align: 'right', headerAlign: 'right',
      renderCell: (params) => (
        <div
          className="flex gap-2 justify-end"
          style={{ pointerEvents: 'auto' }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            tabIndex={-1}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row as Product);
            }}
          >
            Edit
          </button>
          <button
            tabIndex={-1}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row as Product);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-10">
            <h1 className="text-2xl font-bold mb-4">Products Management</h1>
        </div>

        <div className="col-span-2">
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
              onClick={() => {
                setSelectedProduct({
                  id: '',
                  title: '',
                  stock: '',
                  price: '',
                  image: '',
                });
                setOpenEditModal(true);
              }}
            >
                Add Product
            </button>
        </div>
    </div>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        disableColumnMenu
        hideFooterSelectedRowCount
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        autoHeight
        pageSizeOptions={[10, 20, 50]}
      />
      <CommonModal
        width="600px"
        title={selectedProduct?.id === '' ? 'Add Product' : 'Edit Product'}
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        footer={
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setOpenEditModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleSaveProduct}
            >
              Save
            </button>
          </div>
        }
      >
        {selectedProduct && (
          <EditProductModalComp
            selected={selectedProduct}
            onChange={(field, value) =>
              setSelectedProduct((prev) =>
                prev ? { ...prev, [field]: value } : prev
              )
            }
          />
        )}
      </CommonModal>
    </div>
  );
}
