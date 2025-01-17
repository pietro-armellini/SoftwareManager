//function used to add to functions the needed proprierties to be a LowestLevelFunctionStatus
export const addOthersProperties = (elements) => {
	return elements.map((element) => ({
		...element,
		status: element.status ?? 1,
		effort: element.effort ?? "",
		startDate: element.startDate ?? null,
		endDate: element.endDate ?? null,
	}));
}