import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormInputText } from "../form/FormInputText";
import { useForm } from "react-hook-form";

import { Button, CircularProgress, Divider, styled } from '@mui/material';
import { FormInputDropdown } from '../form/FormInputDropdown';
import { useEffect, useState } from 'react';
import { FormGrid } from '@/styles/style';
import { FirmwareAddFormSchema } from '@/utility/ZodHelper';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


//Component to edit Firmwares
export default function FirmwareEdit({ elementToEdit, handleCloseFromParentDialog }) {

	//Options to select
	const [productsOption, setProductsOption] = React.useState([]);
	const [componentTypesOption, setComponentTypeOption] = React.useState([]);
	const [customersOption, setCustomersOption] = React.useState([]);

	const [loading, setLoading] = useState(false); // Loading state

	async function fetchCustomerOption() {
		const response = await fetch("/api/customers/list");
		const jsonData = await response.json();
		setCustomersOption(jsonData.data);
		return jsonData
	}

	async function fetchComponentTypes() {
		const response = await fetch("/api/utils/componenttypes");
		const jsonData = await response.json();
		setComponentTypeOption(jsonData.data);
		return jsonData
	}

	async function fetchProducts() {
		const response = await fetch("/api/products/list");
		const jsonData = await response.json();
		setProductsOption(jsonData.data);
		return jsonData
	}

	//async functions to wait for all the fetches to be over before setting the loading variable to true
	async function fetchWaiter() {
		setLoading(true)
		await Promise.all([fetchProducts(), fetchComponentTypes(), fetchCustomerOption()]);
		setLoading(false)
	}

	useEffect(() => {
		fetchWaiter();
	}, []);

	//default form's values
	const defaultValues = {
		partNumber: elementToEdit.partNumber,
		versionString: elementToEdit.versionString,
		componentType: elementToEdit.componentTypeId,
		product: elementToEdit.productId,
		customer: elementToEdit.customerId,
	}

	type FormFields = z.infer<typeof FirmwareAddFormSchema>;

	const { handleSubmit, control } = useForm<FormFields>({
		mode: "onBlur",
		reValidateMode: "onBlur",
		resolver: zodResolver(FirmwareAddFormSchema),
		defaultValues: defaultValues,
	});


	//function to handle submit
	const onSubmit = (data: FormFields) => {
		setLoading(true)
		fetch('/api/firmwares/editFirmware', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				{
					"id": elementToEdit.id,
					"partNumber": data.partNumber,
					"versionString": data.versionString,
					"componentTypeId": data.componentType,
					"productId": data.product,
					"customerId": data.customer,
				}),
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Network response was not successful.');
				}
			})
			.then(data => {
				//code == 1 => success
				if (data.code == 1) {
					handleCloseFromParentDialog();
				}
			}).catch(() => setLoading(false));  //set loading to false if the result is an error    


	};

	return (
		<Box sx={{ flexGrow: 1, pl: 3, pr: 3, mt: 0, mb: 3 }} >
			<Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
				Edit Firmware
			</Typography>
			<Divider />

			{/* Loading component */}
			{loading ? ( // Check if data is loading
				<Box display="flex" alignItems="center" justifyContent="center" sx={{ mt: 5 }}>
					<CircularProgress /> {/* Loading spinner */}
				</Box>
			) : (
				<form noValidate autoComplete="off">
					<Grid container spacing={3} sx={{ marginLeft: -6 }}>
						<Grid item xs={12}>
							<Typography sx={{ ml: 3, mt: 3 }} variant="h6" component="div">
								Firmware Information
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Grid sx={{ margin: 0 }} container spacing={3}>

								{/* Input: Part Number */}
								<Grid item xs={6}>
									<FormInputText name="partNumber" control={control} label="Part Number" rules={{ required: "This field is required" }} />
								</Grid>

								{/* Input: Version String */}
								<Grid item xs={6}>
									<FormInputText name="versionString" control={control} label="Version String" rules={{ required: "This field is required" }} />
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={4}>
							<Grid sx={{ margin: 0 }} container spacing={3}>

								{/* Input: Component Type */}
								<FormGrid item xs={12}>
									<FormInputDropdown
										name="componentType"
										control={control}
										label="Component type"
										options={componentTypesOption}
									/>
								</FormGrid>
							</Grid>
						</Grid>
						<Grid item xs={4}>
							<Grid sx={{ margin: 0 }} container spacing={3}>
								
								{/* Input: Product */}
								<FormGrid item xs={12}>
									<FormInputDropdown
										name="product"
										control={control}
										label="Product"
										options={productsOption}
									/>
								</FormGrid>
							</Grid>
						</Grid>
						<Grid item xs={4}>
							<Grid sx={{ margin: 0 }} container spacing={3}>

								{/* Input: Customer */}
								<FormGrid item xs={12}>
									<FormInputDropdown
										name="customer"
										control={control}
										label="Customer"
										options={customersOption}
									/>
								</FormGrid>
							</Grid>
						</Grid>

					</Grid>
					<Box display="flex" justifyContent="center" sx={{ mt: 5 }}>

						<Button variant="contained" onClick={handleSubmit(onSubmit)}>
							Edit Firmware
						</Button>
					</Box>
				</form>
			)}
		</Box>
	);
}