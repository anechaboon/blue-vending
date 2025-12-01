'use client';

import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getCashes, createCash, updateCash, deleteCash } from '@/services/cash';
import CommonModal from '@/app/components/CommonModal';
import EditCashModalComp from '@/app/components/EditCashModalComp';
import { apiFetch } from '@/services/api';
import Swal from 'sweetalert2';

export interface Cash {
  id: number | string;
  cash_type: string;
  cash: number;
  stock: number;
  is_active?: boolean;
}

export default function CashAdminPage() {
  const [data, setData] = useState<Cash[]>([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedCash, setSelectedCash] =
    useState<Cash | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const cashes = await getCashes('?is_active=all');
      setData(cashes);
    };
    fetchData();
  }, []);

  const handleEdit = (row: Cash) => {
    setSelectedCash(row);
    setOpenEditModal(true);
  };

  const handleDelete = (row: Cash) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete cash "${row.cash_type} - ${row.cash}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteCash(Number(row.id));

          if (!res.status) {
            Swal.fire('Error', 'Failed to delete cash', 'error');
            return;
          }

          Swal.fire('Deleted!', 'Cash has been deleted.', 'success').then(() => {
            // Refresh data
            getCashes('?is_active=all').then((cashes) => setData(cashes));
          });
        } catch (err) {
          console.log('Error:', err);
        }
      }
    });
  };

  async function handleSaveCash() {
    if (!selectedCash) return;

    try {
      const formData = new FormData();
      formData.append('cash_type', selectedCash.cash_type);
      formData.append('cash', selectedCash.cash.toString());
      formData.append('stock', selectedCash.stock.toString());
      formData.append('is_active', (selectedCash.is_active ? 1 : 0).toString());

      let res, msgSuccess, msgError;

      if( selectedCash.id === '') {
        // New cash
        res =  await createCash(formData);
        msgSuccess = 'Cash created successfully';
        msgError = 'Failed to create cash';
        
      }else{
        // Update existing cash
        res = await updateCash(Number(selectedCash.id), formData);
        msgSuccess = 'Cash updated successfully';
        msgError = 'Failed to update cash';
        
      }
      if (!res.status) {
        Swal.fire('Error', msgError, 'error');
        return;
      }
      Swal.fire('Success', msgSuccess, 'success').then(() => {
        // Refresh data
        getCashes('?is_active=all').then((cashes) => setData(cashes));
      });

      setOpenEditModal(false);

    } catch (err) {
      console.log('Error:', err);
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'cash_type', headerName: 'Cash Type', flex: 1 },
    { field: 'cash', headerName: 'Cash', flex: 1 },
    { field: 'stock', headerName: 'Stock', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      width: 180,
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
              handleEdit(params.row as Cash);
            }}
          >
            Edit
          </button>
          <button
            tabIndex={-1}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row as Cash);
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
            <h1 className="text-2xl font-bold mb-4">Cash Management</h1>
        </div>

        <div className="col-span-2">
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
              onClick={() => {
                setSelectedCash({
                  id: '',
                  cash_type: '',
                  cash: 0,
                  stock: 0
                });
                setOpenEditModal(true);
              }}
            >
                Add Cash
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
              onClick={handleSaveCash}
            >
              Save
            </button>
          </div>
        }
      >
        {selectedCash && (
          <EditCashModalComp
            selected={selectedCash}
            onChange={(field, value) =>
              setSelectedCash((prev) =>
                prev ? { ...prev, [field]: value } : prev
              )
            }
          />
        )}
      </CommonModal>
    </div>
  );
}
