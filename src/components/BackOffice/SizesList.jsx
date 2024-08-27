import React, { useEffect, useState } from 'react';
import api from "../../services/SizeService"; // giả sử bạn có file api.js để xử lý các cuộc gọi API
import { parseFields } from '../../utils';
import TableComponent from '../BaseComponent/TableComponent';
  
   const Sizes = () => {
     const [data, setData] = useState([]);
     const [columns, setColumns] = useState([]);
     
  
     useEffect(() => {
       const fetchData = async () => {
         try {
           const response = await api.getAllSizes();
           setData(response.data.dataTable);
           setColumns(response.data.columns);
           console.log(response.data);
         } catch (error) {
           console.error('Error fetching data:', error);
         }
       };
   
       fetchData();
     }, []);
   
     const addRow = async (newRow) => {
      console.log('add row currency: ', newRow)
       
      // Sử dụng hàm parsePrices để chuyển đổi dữ liệu
      const parsedData = parseFields(newRow);
       try {
         const response = await api.createSize(parsedData);
         setData([...data, response.data]);
       } catch (error) {
         console.error('Error adding row:', error);
       }
     };
   
     const editRow = async (index, updatedRow) => {
       console.log('Edit row:', index, data[index].ID)
        // Sử dụng hàm parsePrices để chuyển đổi dữ liệu
        const parsedData = parseFields(updatedRow);
       try {
         const response = await api.updateSize(data[index].ID, parsedData);
         const newData = data.map((row, rowIndex) => {
           if (rowIndex === index) {
             return response.data;
           }
           return row;
         });
         setData(newData);
       } catch (error) {
         console.error('Error editing row:', error);
       }
     };
   
     const deleteRow = async (index) => {
       try {
         await api.deleteSize(data[index].ID);
         const newData = data.filter((_, rowIndex) => rowIndex !== index);
         setData(newData);
       } catch (error) {
         console.error('Error deleting row:', error);
       }
     };
   
     return (
     
        <TableComponent
          title="Size"
          datas={data}
          column={columns}
          onAddRow={addRow}
          onEditRow={editRow}
          onDeleteRow={deleteRow}
        />
     );
   };
   
   export default Sizes;
   