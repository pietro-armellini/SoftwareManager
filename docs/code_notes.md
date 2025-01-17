# Code Notes - Software Manager - Frontend

## Table of Contents
- [General Information](#general-information)
- [Project Structure](#project-structure)
- [Code Overview](#code-overview)
- [Known Issues and Todos](#known-issues-and-todos)
- [Full Project Structure](#full-project-structure)


---

## General Information
Frontend Github Page: [Frontend](https://github.com)  
Backend Github Page: [Backend](https://github.com)

## Project Structure
<pre>
.  
├── docs  
├── public  
└── src  
    ├── app  
    │   ├── applications  
    │   │   └── addapplication  
    │   ├── customers  
    │   │   └── addcustomer  
    │   ├── dashboard  
    │   ├── firmwares  
    │   │   └── addfirmware  
    │   ├── functions  
    │   │   └── addfunction  
    │   ├── products  
    │   │   └── addproduct  
    │   └── ui  
    │       ├── applications  
    │       ├── customers  
    │       ├── dashboard  
    │       ├── firmwares  
    │       ├── form  
    │       ├── functions  
    │       └── products  
    ├── styles  
    │   └── theme  
    └── utility  
</pre>

## Code Overview

The structure of the project's visual components and core functionality is organized within the `app` folder. Below is an outline of its main contents and purpose of each subfolder:

- **`app` Folder**: Contains the main application components and layout files.
  - **`ui/`**: Holds all reusable UI components used throughout the app.
    - **`ui/form/`**: Contains all input components used across various forms in the application.
  - **Navigation Folders**: The following folders are used for main navigation and contain corresponding pages:
    - **`applications/`**
    - **`customers/`**
    - **`firmwares/`**
    - **`functions/`**
    - **`products/`**
    - Each of these folders includes a `page.tsx` file, which serves as a wrapper for the main page of each section.
  - **Add Item Pages**: Each navigation folder (except for `dashboard`) includes an additional subfolder named `add+[name]`, designed to contain pages for adding new items within that section.
  - **Main App Files**:
    - **`page.tsx`**: Located in the root of the `app` folder, this file is used solely for redirecting users to the dashboard (`/dashboard`).
    - **`layout.tsx`**: Defines the global layout for the entire application, ensuring consistency in structure across all pages.

## Known Issues and Todos

### Issues:
- **Edit Functionality**: The edit function is unstable and does not work properly.
- **Module Level**: When adding a new function, the module level must be set to "Lowest Level Function," even though this is not intuitive.

### Todos:
- **Backend Connection Failures**: The system does not display any errors or issues when the connection to the backend fails, but it continues to load indefinitely.
- **Page Responsiveness**: Most of the pages are not responsive, and adjustments are needed for better mobile and tablet compatibility.
- **Snackbar Components**: The Snackbar components used throughout the application should be refactored into a smaller set of reusable components to improve maintainability and reduce redundancy.
- **API Call Refactoring**: All API calls can be refactored into a smaller number of helper functions contained within a single file to streamline code and reduce duplication.
- **Pagination for Tables**: Currently, only the functions table supports pagination for handling large amounts of data. This pagination component should be applied to all tables in the system.


## Full Project Structure

<pre>
.
├── docs
│   └── code_notes.md
├── next.config.mjs	
├── next-env.d.ts
├── package.json
├── package-lock.json
├── pnpm-lock.yaml
├── public
│   ├── next.svg
│   └── vercel.svg
│── README.md
│── tsconfig.json
└── src
    ├── app
    │   ├── applications
    │   │   ├── addapplication
    │   │   │   └── page.tsx
    │   │   └── page.tsx
    │   ├── customers
    │   │   ├── addcustomer
    │   │   │   └── page.tsx
    │   │   └── page.tsx
    │   ├── dashboard
    │   │   └── page.tsx
    │   ├── firmwares
    │   │   ├── addfirmware
    │   │   │   └── page.tsx
    │   │   └── page.tsx
    │   ├── functions
    │   │   ├── addfunction
    │   │   │   └── page.tsx
    │   │   └── page.tsx
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── products
    │   │   ├── addproduct
    │   │   │   └── page.tsx
    │   │   └── page.tsx
    │   └── ui
    │       ├── AppBar.tsx
    │       ├── applications
    │       │   ├── ApplicationAdd.tsx
    │       │   ├── ApplicationBasicInformationDisplay.tsx
    │       │   ├── ApplicationEdit.tsx
    │       │   ├── ApplicationsTablePercentage.tsx
    │       │   ├── ApplicationsTable.tsx
    │       │   ├── FunctionsListEdit.tsx
    │       │   └── SelectedFunctionsList.tsx
    │       ├── customers
    │       │   ├── CustomerAdd.tsx
    │       │   ├── CustomerEdit.tsx
    │       │   └── CustomersTable.tsx
    │       ├── dashboard
    │       │   ├── CustomTabPanel.tsx
    │       │   ├── FunctionInfo.tsx
    │       │   ├── Legend.tsx
    │       │   ├── OtherInformationView.tsx
    │       │   ├── TableView.tsx
    │       │   └── TreeComponent.tsx
    │       ├── firmwares
    │       │   ├── FirmwareAdd.tsx
    │       │   ├── FirmwareBasicInformationDisplay.tsx
    │       │   ├── FirmwareEdit.tsx
    │       │   ├── FirmwaresTablePercentage.tsx
    │       │   ├── FirmwaresTable.tsx
    │       │   ├── FunctionsListEdit.tsx
    │       │   ├── OtherOptionsEdit.tsx
    │       │   └── SelectedFunctionsList.tsx
    │       ├── form
    │       │   ├── FormInputApplicationAdd.tsx
    │       │   ├── FormInputAutocomplete.tsx
    │       │   ├── FormInputCheckbox.tsx
    │       │   ├── FormInputDate.tsx
    │       │   ├── FormInputDropdown.tsx
    │       │   ├── FormInputFirmwareAdd.tsx
    │       │   ├── FormInputNumber.tsx
    │       │   └── FormInputText.tsx
    │       ├── functions
    │       │   ├── FuncionsTable.tsx
    │       │   ├── FunctionAdd.tsx
    │       │   └── FunctionEdit.tsx
    │       ├── ListItems.tsx
    │       └── products
    │           ├── ProductAdd.tsx
    │           ├── ProductEdit.tsx
    │           └── ProductsTable.tsx
    ├── styles
    │   ├── globals.css
    │   ├── page.module.css
    │   ├── StyleRoot.tsx
    │   ├── style.tsx
    │   ├── theme
    │   │   └── lightTheme.js
    │   └── theme.ts
    └── utility
        ├── Api.ts
        ├── DataHelper.tsx
        ├── FormsHelper.ts
        ├── Interfaces.ts
        ├── TreeHelper.ts
        └── ZodHelper.ts
</pre>
