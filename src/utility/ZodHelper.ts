import { z } from "zod";

// Application Add Form Schema
export const ApplicationAddFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	applications: z.array(z.any()).optional(), // Optional array of applications
	selectedLowestLevelFunctions: z.array(z.number()).optional(),
	function: z.custom().optional(),
});

// Firmware Add Form Schema
export const FirmwareAddFormSchema = z.object({
	partNumber: z.string().min(1, "Part Number is required"),
	versionString: z.string().min(1, "Version String is required"),
	firmwares: z.array(z.any()).optional(), // Optional array of firmwares
	selectedLowestLevelFunctions: z.array(z.custom()).optional(),
	componentType: z.number().gte(0, { message: "Component Type is required" }),
	product: z.number().gte(0, { message: "Product is required" }),
	customer: z.number().gte(0, { message: "Customer is required" }),
	function: z.custom().optional(),
});

// Other Options Edit Schema
export const OtherOptionsEditSchema = z.object({
	status: z.number().optional(),
	effort: z.string().optional(),
	startDate: z.preprocess(
		(arg) => arg === null ? null : new Date(arg as string), 
		z.date().nullable()
	),
	endDate: z.preprocess(
		(arg) => arg === null ? null : new Date(arg as string), 
		z.date().nullable()
	),
})
//check if endDate is after startDate
.refine((data) => {
	return data.endDate === null || data.startDate === null || data.endDate > data.startDate;
}, {
	message: "End Date must be after Start Date",
	path: ["endDate"],
});

// Function Add Form Schema
export const FunctionAddFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	lowestLevelFunction: z.boolean(),
	functionLevel: z.number({ required_error: "Function Level is required" }),
	parentId: z.custom(),
	applications: z.array(z.any()),
})
.refine(
  //check if ParentFunction has to be set
	(data) => !(data.functionLevel !== undefined && data.functionLevel != 1 && data.parentId === undefined),
	{
		message: "Parent Function is required when Function Level is defined",
		path: ["parentId"],
	}
);

// Product Add Form Schema
export const ProductAddFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
});

// Customer Add Form Schema
export const CustomerAddFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
});
