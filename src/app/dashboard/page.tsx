'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Dialog, DialogContent, DialogActions, Button, Typography, styled, Tabs, Tab, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormInputFunctionAutocomplete } from '../ui/form/FormInputAutocomplete';
import { getNodeById } from '@/utility/DataHelper';
import { FormInputDeletableDropdown } from '../ui/form/FormInputDropdown';
import { LegendTable, LegendTree } from '../ui/dashboard/Legend';
import { getPercentage } from '@/utility/Api';
import { a11yProps, CustomTabPanel } from '../ui/dashboard/CustomTabPanel';
import { OtherInformationView } from '../ui/dashboard/OtherInformationView';
import { ReactECharts } from '../ui/dashboard/TreeComponent';
import { TableView } from '../ui/dashboard/TableView';
import FunctionInfo from '../ui/dashboard/FunctionInfo';
import { processFunctionElements, buildTree, filterTree, countElements, addStatusToTree } from '@/utility/TreeHelper';
import { FormGrid } from '@/styles/style';


//Comoonet displaying the main page
export default function Dashboard() {
	const [showDialog, setShowDialog] = useState(false);

	//state variable to track the id of the function the user presses on
	const [idInfo, setIdInfo] = useState(0);

	//options
	const [applicationOptions, setApplicationOptions] = useState<any[]>([]);
	const [statusOption, setStatusOption] = useState<any[]>([]);
	const [firmwareOptions, setFirmwareOptions] = useState<any[]>([]);

	const [loading, setLoading] = useState(true); // Loading state
	const [includedPercentage, setIncludedPercentage] = useState(0);
	const [finishedPercentage, setFinishePercentage] = useState(0);
	const [data, setData] = useState<any[]>([]);
	const [tabValue, setTabValue] = React.useState(0);

	//trees state variables
	const [displayDataSize, setDisplayDataSize] = useState(1400);
	const [tree, setTree] = useState<any[]>([]);

	//filters
	interface IFormInput {
		application: number | null;
		firmware: number | null;
		function: any;
		status: number | null;
	}

	const defaultValues = {
		application: null,
		firmware: null,
		function: undefined,
		status: null,
	};

	const { control, getValues, setValue, watch } = useForm<IFormInput>({
		defaultValues: defaultValues,
	});

	useEffect(() => {
		setLoading(true)
		fetchWaiter();
		reloadTree();
	}, []);

	// Fetches multiple resources simultaneously and waits for all of them to complete
	async function fetchWaiter() {
		await Promise.all([fetchApplications(), fetchStatus(), fetchFirmwares(), fetchData()]);
		setLoading(false)
	}

	const fetchData = async () => {
		try {
			const response = await fetch(`/api/functions/detailedlist`);
			const jsonData = await response.json();

			//process elements: add to each element a chain of parents til they reach the root node
			setData(processFunctionElements(jsonData.data));
			return jsonData
		} catch (error) {
		}
	};
	async function fetchApplications() {
		const response = await fetch("/api/applications/list");
		const jsonData = await response.json();
		setApplicationOptions(jsonData.data);
		return jsonData
	}
	async function fetchStatus() {
		const response = await fetch("/api/utils/status");
		const jsonData = await response.json();
		setStatusOption(jsonData.data);
		return jsonData
	}

	async function fetchFirmwares() {
		const response = await fetch("/api/firmwares/detailedlist");
		const jsonData = await response.json();

		//update data adding a new parameter called name which is the concat of partNumber and versionString
		const updatedData = jsonData.data.map((firmware) => {
			const name = firmware.partNumber + " " + firmware.versionString;
			return { ...firmware, name };
		});

		setFirmwareOptions(updatedData);
		return jsonData
	}

	//function to open the function's information Dialog
	const handleOpenDialog = (id) => {
		setIdInfo(id);
		setShowDialog(true);
	};

	//function to handle the change of the filter inputs, calling the reload of the tree
	const onFilterChange = () => {
		reloadTree();
	}

	//this function reloads the tree based on the filters selected
	//it works proprerly but it definitely needs refactoring, it's not clear and it is for sure possible to make it more efficient
	function reloadTree() {
		const applicationFilteredIds: number[] = [];
		const firmwareFilteredIds: number[] = [];
		// Iterate through the data to filter applications and firmware
		for (const element of data) {
			if (getValues("application") != null) {
				if (element.functionApplication.length != 0) {
					for (let application of element.functionApplication) {
						if (application.applicationId === getValues("application")) {
							applicationFilteredIds.push(element.id);
						}
					}
				}
			}
			if (getValues("firmware") != null) {
				if (element.lowestLevelFunctionStatus.length != 0) {
					for (let status of element.lowestLevelFunctionStatus) {
						if (status.firmwareId === getValues("firmware")) {
							firmwareFilteredIds.push(element.id);
						}
					}
				}
			}
		}

		let filteredIds: number[] = [];
		let rootName = "";
		let includeStatus = false;
		if (getValues("firmware") != null && getValues("application") != null) {
			// When both firmware and application filters are applied
			includeStatus = true;
			filteredIds = applicationFilteredIds.filter(value => firmwareFilteredIds.includes(value)).concat(applicationFilteredIds);
			getPercentage({ firmwareId: getValues("firmware"), applicationId: getValues("application") }).then((rsl) => {
				setIncludedPercentage((Math.round(parseFloat(rsl.included) * 10000) / 100))
				setFinishePercentage(isNaN(Math.round(parseFloat(rsl.finished) * 10000) / 100) ? 0 : (Math.round(parseFloat(rsl.finished) * 10000) / 100))
			})
		}
		else if (getValues("firmware") == null && getValues("application") != null) {
			filteredIds = applicationFilteredIds;
			rootName = applicationOptions.find((option) => option.id === getValues("application"))?.name
		}
		else if (getValues("firmware") != null && getValues("application") == null) {
			filteredIds = firmwareFilteredIds;
			includeStatus = true;
			rootName = firmwareOptions.find((option) => option.id === getValues("firmware"))?.name
		}

		const processedData = filterTree(data, filteredIds, rootName);

		if (getValues("function") == null) {
			// If no function filter is applied
			//set tree without function (filters == processedData)
			if (includeStatus) {
				setTree([addStatusToTree(processedData[0], getValues("firmware"), getValues("status") as any)]);
			}
			else {
				setTree(processedData);
			}
			setDisplayDataSize(filteredIds.length * 15 + 100)
		}
		else {
			//function is selected
			const selectedFunctionId = getValues("function").id
			if (getNodeById(processedData[0], selectedFunctionId) != null) {
				//function has been found in the already selected filters
				if (includeStatus) {
					//firmware has been selected
					const new_tree = [addStatusToTree(getNodeById(processedData[0], selectedFunctionId), getValues("firmware"), getValues("status") as any)];
					setTree(new_tree)
					setDisplayDataSize(countElements(new_tree) * 15 + 100);
				}
				else {
					const new_tree = [getNodeById(processedData[0], selectedFunctionId)]
					setTree(new_tree)
					setDisplayDataSize(countElements(new_tree) * 15 + 100);
				}
			}
			else {
				//function has not been found in the filterIds
				if (getValues("application") == null && getValues("firmware") == null) {
					//if application and application are not setted show all the children of the selected function
					const new_tree = buildTree(data, getValues("application"), false, selectedFunctionId);
					setTree(new_tree);
					setDisplayDataSize(countElements(new_tree) * 15 + 100);
				}
				else {
					//if one of them is set show nothig
					const new_tree = [];
					setTree(new_tree);

				}
			}
		}

	}

	//function to handle change of the tab
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	return (
  <Box
    component="main"
    sx={{
      backgroundColor: (theme) =>
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[900],
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
      px: 2,
    }}
  >
    {/* Function's information dialog */}
    <Dialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      fullWidth
      maxWidth="lg"
    >
      <DialogContent>
        <FunctionInfo id={idInfo} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowDialog(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>

    <Toolbar />

    <Container sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            sx={{
              pt:2,
							pl:3,
							pr:3,
							pb: 2,
              width: '100%',
              minHeight: 220,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Dashboard heading */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" component="div">
                  Dashboard
                </Typography>
              </Grid>
            </Grid>

            {/* Loading */}
            {loading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 5 }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* Filters */}
                <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormInputDeletableDropdown
                      control={control}
                      name="firmware"
                      label="Firmware"
                      options={firmwareOptions}
                      onSelectedChange={onFilterChange}
                     />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormInputDeletableDropdown
                      name="application"
                      control={control}
                      label="Application"
                      options={applicationOptions}
                      onSelectedChange={onFilterChange}
                     
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormInputFunctionAutocomplete
                      control={control}
                      name="function"
                      label="Function"
                      options={data}
                      onSelectedChange={onFilterChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormInputDeletableDropdown
                      control={control}
                      name="status"
                      label="Status"
                      options={statusOption}
                      onSelectedChange={onFilterChange}
                      disabled={watch("firmware") === undefined}
                    />
                  </Grid>
                </Grid>

                {/* Tabs */}
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                      value={tabValue}
                      variant="fullWidth"
                      onChange={handleChange}
                      aria-label="tabs"
                    >
                      <Tab label="Tree View" {...a11yProps(0)} />
                      <Tab label="Table View" {...a11yProps(1)} />
                      <Tab label="Other Information" {...a11yProps(2)} />
                    </Tabs>
                  </Box>

                  {/* Tree View */}
                  <CustomTabPanel value={tabValue} index={0}>
                    {watch("firmware") !== undefined && (
                      <LegendTree
                        includedPercentage={includedPercentage}
                        showPercentage={
                          watch("firmware") !== undefined &&
                          watch("application") !== undefined
                        }
                        finishedPercentage={finishedPercentage}
                      />
                    )}
                    <ReactECharts
                      data={tree}
                      data_size={displayDataSize}
                      handleOpenDialog={handleOpenDialog}
                      applyColors={watch("firmware") !== undefined}
                    />
                  </CustomTabPanel>

                  {/* Table View */}
                  <CustomTabPanel value={tabValue} index={1}>
                    {watch("firmware") !== undefined && (
                      <LegendTree
                        includedPercentage={includedPercentage}
                        showPercentage={
                          watch("firmware") !== undefined &&
                          watch("application") !== undefined
                        }
                        finishedPercentage={finishedPercentage}
                      />
                    )}
                    <TableView
                      tree={tree}
                      handleOpenDialog={handleOpenDialog}
                    />
                  </CustomTabPanel>

                  {/* Other Info */}
                  <CustomTabPanel value={tabValue} index={2}>
                    <OtherInformationView
                      firmware={
                        watch("firmware") !== undefined
                          ? firmwareOptions.find(
                              (option) =>
                                option.id === getValues("firmware")
                            )
                          : null
                      }
                      application={
                        watch("application") !== undefined
                          ? applicationOptions.find(
                              (option) =>
                                option.id === getValues("application")
                            )
                          : null
                      }
                    />
                  </CustomTabPanel>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

}



