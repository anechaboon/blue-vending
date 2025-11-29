'use client';

import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getAttractionList } from '@/app/components/Attractions';
import CommonModal from '@/app/components/CommonModal';
import EditAttractionModalComp from '@/app/components/EditAttractionModalComp';
import { apiFetch } from '@/services/api';
import Swal from 'sweetalert2';

export interface Attraction {
  id: number | string;
  name: string;
  location: string;
  description: string;
  cover_image: string | File;
}
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AttractionsAdminPage() {
  const [data, setData] = useState<Attraction[]>([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedAttraction, setSelectedAttraction] =
    useState<Attraction | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const attractions = await getAttractionList();
      setData(attractions);
    };
    fetchData();
  }, []);

  const handleEdit = (row: Attraction) => {
    setSelectedAttraction(row);
    setOpenEditModal(true);
  };

  const handleDelete = (row: Attraction) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete attraction "${row.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await apiFetch(
            `${BASE_URL}/api/attractions/${row.id}`,
            {
              method: 'DELETE',
            }
          );

          if (!res.status) {
            Swal.fire('Error', 'Failed to delete attraction', 'error');
            return;
          }

          Swal.fire('Deleted!', 'Attraction has been deleted.', 'success').then(() => {
            // Refresh data
            getAttractionList().then((attractions) => setData(attractions));
          });
        } catch (err) {
          console.log('Error:', err);
        }
      }
    });
  };

  async function handleSaveAttraction() {
    if (!selectedAttraction) return;

    try {
      const formData = new FormData();
      formData.append('name', selectedAttraction.name);
      formData.append('description', selectedAttraction.description);
      formData.append('location', selectedAttraction.location);
      if (selectedAttraction.cover_image instanceof File) {
        formData.append('cover_image', selectedAttraction.cover_image);
      }

      let res, msgSuccess, msgError;

      if( selectedAttraction.id === '') {
        // New attraction
        res =  await apiFetch(
          `${BASE_URL}/api/attractions`,
          {
            method: 'POST',
            body: formData,
          }
        );
        msgSuccess = 'Attraction created successfully';
        msgError = 'Failed to create attraction';
        
      }else{
        // Update existing attraction
        res = await apiFetch(
          `${BASE_URL}/api/attractions/${selectedAttraction.id}`,
          {
            method: 'PUT',
            body: formData,
          }
        );
        msgSuccess = 'Attraction updated successfully';
        msgError = 'Failed to update attraction';
        
      }
      if (!res.status) {
        Swal.fire('Error', msgError, 'error');
        return;
      }
      Swal.fire('Success', msgSuccess, 'success').then(() => {
        // Refresh data
        getAttractionList().then((attractions) => setData(attractions));
      });

      setOpenEditModal(false);

    } catch (err) {
      console.log('Error:', err);
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
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
              handleEdit(params.row as Attraction);
            }}
          >
            Edit
          </button>
          <button
            tabIndex={-1}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row as Attraction);
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
            <h1 className="text-2xl font-bold mb-4">Attractions Management</h1>
        </div>

        <div className="col-span-2">
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
              onClick={() => {
                setSelectedAttraction({
                  id: '',
                  name: '',
                  location: '',
                  description: '',
                  cover_image: '',
                });
                setOpenEditModal(true);
              }}
            >
                Add Attraction
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
              onClick={handleSaveAttraction}
            >
              Save
            </button>
          </div>
        }
      >
        {selectedAttraction && (
          <EditAttractionModalComp
            selected={selectedAttraction}
            onChange={(field, value) =>
              setSelectedAttraction((prev) =>
                prev ? { ...prev, [field]: value } : prev
              )
            }
          />
        )}
      </CommonModal>
    </div>
  );
}
