import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box"
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { getChildren } from '@/utility/DataHelper';
import { FunctionElement } from '@/utility/Interfaces';
import { getColor, getParentNames } from '@/utility/TreeHelper';

export function TableView({tree, handleOpenDialog}) {
  const [tableData, setTableData] = useState<any[]>([]);
  
  useEffect(() => {
    prepareData();
  }, [tree]);

  const prepareData = async () => {
    const functions: FunctionElement[] = getChildren(tree[0]);
    setTableData(functions)
  };

  return (
    <Box>     
      <TableContainer component={Paper} sx={{paddingLeft:3, paddingRight:3, mt:2}}>
        <Table sx={{width:'100%', marginBottom:3}} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 15}} align="left"><b>Strategic Layer</b> </TableCell>
              <TableCell sx={{ fontSize: 15}} align="left"><b>Operational Layer</b></TableCell>
              <TableCell sx={{ fontSize: 15}} align="left"><b>Framework Layer</b></TableCell>
              <TableCell sx={{ fontSize: 15}} align="left"><b>Name</b></TableCell>
              <TableCell sx={{ fontSize: 15}} align="right"><b></b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => {

              const color = ((row.status!=undefined) == (Object.hasOwn(row,"status") && row.toRemove==false)?"black":"lightgray");
              
              const applyStatus = (Object.hasOwn(row,"status")?getColor(row):null);
              //if row has not status show it
              //if row has status but null then don't show it
              return (
                
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                      <Typography sx={{ fontSize: 13, color: color}}>{getParentNames(row)[0]}</Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                      <Typography sx={{ fontSize: 13, color: color}}>{getParentNames(row)[1]} </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                      <Typography sx={{ fontSize: 13, color: color}}>
                        {
                          (row.lowestLevel && row.functionLevel.name=="Core Level"?"-":getParentNames(row)[2])
                        }</Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography onClick={() => {handleOpenDialog(row.id)}} sx={{ fontSize: 13, color: color}}>
                      <b>
                        {row.name}
                      </b>
                    </Typography>
                  </TableCell>
                  <TableCell>
                  {(applyStatus!=null?(
                            <Box sx={{ display: 'inline-flex'}}>
                            <Box
                              sx={{
                                width: '10px', // Adjust to your desired width
                                height: '10px', // Adjust to your desired height
                                border: applyStatus ? `2px solid ${applyStatus}` : 'none', // Border with color
                                backgroundColor: applyStatus ? applyStatus : 'transparent', // Fill color
                              }}
                            />
                          </Box>
                        ):null)}
                  </TableCell>
                
                </TableRow>
              )

            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}