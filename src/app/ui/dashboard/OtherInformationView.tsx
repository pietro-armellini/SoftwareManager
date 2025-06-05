import * as React from 'react';
import Box from "@mui/material/Box"
import { ApplcationBasicInformationDisplay } from '../applications/ApplicationBasicInformationDisplay';
import ApplicationsTablePercentage from '../applications/ApplicationsTablePercentage';
import { FirmwareBasicInformationDisplay } from '../firmwares/FirmwareBasicInformationDisplay';
import FirmwaresTablePercentage from '../firmwares/FirmwaresTablePercentage';

/* 
	Component for showing information about the application, the firmware, and the completition of applications in firmwares and vice versa
	If application is selected show basic information about the application
	If firmware is selected show basic information about the firmware
*/
export function OtherInformationView({ firmware, application }) {
  return (
    <Box sx={{ minWidth: 0, marginBottom:3}}>
      {/* Only display if application is not null */}
      {application && <ApplcationBasicInformationDisplay application={application} />}

      {/* Only display if firmware is not null */}
      {firmware && <FirmwareBasicInformationDisplay firmware={firmware} />}

      {/* Only display if firmware is not null and application is null */}
      {firmware && !application && <ApplicationsTablePercentage firmware={firmware}/>}

      {/* Only display if application is not null and firmware is null */}
      {!firmware && application && <FirmwaresTablePercentage application={application} />}

    </Box>
  );
}

