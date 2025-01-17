

//given the firmware and the application get the percentage of application's functions included and finished of the firmware
export const getPercentage = async ({ firmwareId, applicationId }: { firmwareId?: number | null, applicationId?: number | null }) => {

	const response = await fetch(`/api/utils/getcompletepercentage `, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			firmwareId:firmwareId,
			applicationId:applicationId,
		}),
	});

	if (!response.ok) {
		throw new Error('Network response was not successful.');
	}

	const jsonData = await response.json();
	return jsonData

};


