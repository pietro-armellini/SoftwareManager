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
import { CircularProgress, Typography } from '@mui/material';
import { getPercentage } from '@/utility/Api';
import { BorderLinearProgress_blue, BorderLinearProgress_green } from '@/styles/style';

//component that, given an application, shows which firmware and in which percentage the 
//applicationis included in the firmware. And its the percentage of completition
export default function FirmwaresTablePercentage(application:any) {
  const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true); // Loading state
	
	useEffect(() => {
		setLoading(true)
    fetchData();
  }, [application]);
  
  const fetchData = async () => {	
		const data = await getPercentage({applicationId: application.application.id});
		setData(data)
		setLoading(false)
  };

  return (
    <Box>
      <Typography sx={{ mt: 4, mb: 2, ml:4 }} variant="h6" component="div">
        Firmwares
      </Typography>

			{/* Main Table */}
      <TableContainer component={Paper} sx={{paddingLeft:3, paddingRight:3, mt:2}}>
        <Table sx={{ minWidth: 300, marginBottom:3}} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
							{/* Columns names */}
              <TableCell sx={{ fontSize: 15}}><b>Part Number</b></TableCell>
              <TableCell sx={{ fontSize: 15}}><b>Version String</b></TableCell>
              <TableCell sx={{ fontSize: 15}} align='right'><b>Included</b></TableCell>
              <TableCell sx={{ fontSize: 15}}align="right" ><b>Completed</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
						{/* Loading component */}
					{loading ? ( // Check if data is loading
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress /> {/* Loading spinner */}
                    <Typography variant="body2" sx={{ mt: 2 }}>Loading data...</Typography>
                    </TableCell>
              </TableRow>
            ) : data.map((row) => {
							return (
								<TableRow
									key={row.id}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									
									{/* Firmwares Part Numbers */}
									<TableCell component="th" scope="row">
										<Typography sx={{ fontSize: 13 }}>{row.partNumber}</Typography>
									</TableCell>

									{/* Firmwares Version Strings */}
									<TableCell component="th" scope="row">
										<Typography sx={{ fontSize: 13 }}>{row.versionString}</Typography>
									</TableCell>
									
									{/* Included percentage */}
									<TableCell align="right">
										{
											<>
												<Typography sx={{ fontSize: 13 }} variant="body1">
													<b>{isNaN(Math.round(parseFloat(row.percentage.included) * 10000) / 100)?0:(Math.round(parseFloat(row.percentage.included) * 10000) / 100)}%</b>
												</Typography>
												<BorderLinearProgress_blue variant="determinate" value={row.percentage.included*100} />
											</>
										}
									</TableCell>

									{/* Completed percentage */}
									<TableCell align="right">
										{
											<>
											<Typography sx={{ fontSize: 13 }} variant="body1">
												<b>{isNaN(Math.round(parseFloat(row.percentage.finished) * 10000) / 100)?0:(Math.round(parseFloat(row.percentage.finished) * 10000) / 100)}%</b>
											</Typography>
											<BorderLinearProgress_green variant="determinate" value={row.percentage.finished*100} />
										</>
										}
									</TableCell>

								</TableRow>
							);
						})}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}