import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useForm } from "react-hook-form";
import { Button, Divider } from '@mui/material';
import { FormInputDropdown } from '../form/FormInputDropdown';
import { FormGrid } from '@/styles/style';
import { FormInputNumber } from '../form/FormInputNumber';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormInputDate } from '../form/FormInputDate';
import { isoStringToDate } from '@/utility/DataHelper';
import dayjs from 'dayjs';
import { z } from 'zod';
import { OtherOptionsEditSchema } from '@/utility/ZodHelper';
import { zodResolver } from '@hookform/resolvers/zod';


//Component to edit the other information of a firmware - function connection (lowest level function status)
export default function OtherOptionsEdit({ elementToEdit, setNewObject, handleCloseFromParentDialog, statusOptions }) {

	//default form's values
	const defaultValues = {
		status: elementToEdit.status,
		effort: elementToEdit.effort,
		startDate: (elementToEdit.startDate == null ? elementToEdit.startDate : dayjs(isoStringToDate(elementToEdit.startDate))),
		endDate: (elementToEdit.endDate == null ? elementToEdit.endDate : dayjs(isoStringToDate(elementToEdit.endDate))),
	}

	type FormFields = z.infer<typeof OtherOptionsEditSchema>;

	const { handleSubmit, control, getValues } = useForm<FormFields>({
		mode: "onBlur",
		reValidateMode: "onBlur",
		resolver: zodResolver(OtherOptionsEditSchema),
		defaultValues: defaultValues,
	});

	//function to handle submit
	const onSubmit = (data: FormFields) => {
		elementToEdit.status = getValues("status")
		elementToEdit.effort = getValues("effort")

		//startDate
		const dayjsDate1 = dayjs(getValues("startDate"))

		//if date is valid remove the timezone and save it in ISO format
		if (dayjsDate1.isValid()) {
			const d = dayjsDate1.toDate()
			d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
			elementToEdit.startDate = d.toISOString()
		}
		else {
			elementToEdit.startDate = null
		}

		//endDate
		const dayjsDate2 = dayjs(getValues("endDate"))

		//if date is valid remove the timezone and save it in ISO format
		if (dayjsDate2.isValid()) {
			const d = dayjsDate2.toDate()
			d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
			elementToEdit.endDate = d.toISOString()
		}
		else {
			elementToEdit.endDate = null
		}
		setNewObject(elementToEdit)
		handleCloseFromParentDialog();
	}




	return (
		<Box sx={{ flexGrow: 1, pl: 3, pr: 3, mt: 0, mb: 3 }} >
			<Typography sx={{ mt: 3, mb: 1 }} variant="h6" component="div">
				Function name: <b>{elementToEdit.name}</b>
			</Typography>
			<Divider />
			<form noValidate autoComplete="off">
				<Grid container spacing={3} sx={{ marginLeft: -6 }}>
					<Grid item xs={4}>
						<Grid sx={{ margin: 0 }} container spacing={3}>

							{/* Input: Status */}
							<FormGrid item xs={12}>
								<FormInputDropdown
									name="status"
									control={control}
									label="Status"
									options={statusOptions}
								/>
							</FormGrid>
						</Grid>
					</Grid>
					<Grid item xs={2}>
						<Grid sx={{ margin: 0 }} container spacing={3}>

							{/* Input: Status */}
							<FormGrid item xs={12}>
								<FormInputNumber
									name={"effort"}
									label={"Effort"}
									control={control}
								/>
							</FormGrid>
						</Grid>
					</Grid>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Grid item xs={6}>
							<Grid sx={{ margin: 0 }} container spacing={3}>

								{/* Input: Start Date */}
								<FormGrid item xs={6}>
									<FormInputDate
										name={`startDate`}
										label={"Start Date"}
										control={control}
									/>
								</FormGrid>

								{/* Input: End Date */}
								<FormGrid item xs={6}>
									<FormInputDate
										name={`endDate`}
										label={"End Date"}
										control={control}
									/>
								</FormGrid>
							</Grid>
						</Grid>
					</LocalizationProvider>
					<Grid item xs={12}>
						<Box display="flex" justifyContent="right" sx={{ mt: 1, mb: -100, mr: -1 }}>
							<Button variant="contained" onClick={handleSubmit(onSubmit)}>
								Save Data
							</Button>
						</Box>
					</Grid>

				</Grid>
			</form>
		</Box>
	);
}