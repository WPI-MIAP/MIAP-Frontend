### `resources\assets\js\components\App.jsx`

**App** 

### `resources\assets\js\components\layouts\Card.jsx`

**Card** 

### `resources\assets\js\components\layouts\DndTreeContainer.jsx`

**DndTreeContainer** 

### `resources\assets\js\components\layouts\GlobalFilterNav.jsx`

**GlobalFilterNav** 

### `resources\assets\js\components\layouts\MainView.jsx`

**MainView** 

Property | Type | Required | Description
:--- | :--- | :--- | :---
width|||
height|||

### `resources\assets\js\components\modules\D3Tree.jsx`

**D3Tree** 

### `resources\assets\js\components\modules\DistributionRangeSlider.jsx`

**DistributionRangeSlider** 

### `resources\assets\js\components\modules\DndGraph.jsx`

**DndGraph** 

### `resources\assets\js\components\modules\DndTree.jsx`

**DndTree** 

### `resources\assets\js\components\modules\Footer.jsx`

**Footer** 

### `resources\assets\js\components\modules\GalaxyView.jsx`

**GalaxyView** 

### `resources\assets\js\components\modules\Help.jsx`

**Help** 

### `resources\assets\js\components\modules\InteractionProfile.jsx`

**InteractionProfile** 

### `resources\assets\js\components\modules\KnownUnknownDropDown.jsx`

**KnownUnknownDropDown** 

### `resources\assets\js\components\modules\Overview.jsx`

**Overview** 

### `resources\assets\js\components\modules\ProfileView.jsx`

**ProfileView** 

### `resources\assets\js\components\modules\Report.jsx`

**Report** This component shows all reports for a given drug or interaction in a Dialog box.

Property | Type | Required | Description
:--- | :--- | :--- | :---
tableData|PropType array|yes|Array of the reports to display.
drugs|PropType array|yes|Array of the drug (if there is only one) or drugs (if the reports are for a pair of drugs) pertaining to this report.
windowWidth|PropType number|yes|Width of the browser window (used to make components responsive).
open|PropType bool|yes|Indicates whether the report view should be open or not.
handleClose|PropType func|yes|Called when the report view should be closed.
tableTitle|PropType string|yes|Title for the report view.

### `resources\assets\js\components\modules\ReportChipContainer.jsx`

**ReportChipContainer** This component holds chips that link to the report view for any drug or interaction that has been selected.

Property | Type | Required | Description
:--- | :--- | :--- | :---
currentDrugs|PropType array|yes|Array of the currently selected drugs (i.e. the drugs found in the Galaxy View)
links|PropType array|yes|Array of the links between all drugs that interact with eachother.
selectedDrug|PropType string|yes|Name of the currently selected drug.
selectedRule|PropType string|yes|Name of the currently selected rule.
deleteNode|PropType func|yes|Removes the drug from the Galaxy View.
clearSearchTerm|PropType func|yes|Remove the currently selected drug from the Interaction Profile.
clearRule|PropType func|yes|Remove the currently selected rule from the Interaction Profile.
scoreRange|PropType array|yes|Distribution of scores used to generate color.
handleOpen|PropType func|yes|Open reports for a given drug or interaction.

### `resources\assets\js\components\modules\SearchBarComponent.jsx`

**SearchBarComponent** This component allows users to search for drugs in the context of this application.

Property | Type | Required | Description
:--- | :--- | :--- | :---
drugs|PropType array|yes|Array of all drug names to be used for AutoComplete.
handleSearchRequest|PropType func|yes|Function to handle the request for a given drug when it is searched. Takes the selected drug name as a parameter.

### `resources\assets\js\components\modules\StatusInformation.jsx`

**StatusInformation** This component shows status information about the last MARAS analysis ran.
**StatusInformationButton** This component is an icon button that shows a dialog with status information about the last MARAS run when pressed.

Property | Type | Required | Description
:--- | :--- | :--- | :---
status|PropType object|yes|The status of the last analysis ran.
getStatus|PropType func|yes|A function that can be called to get the updated analysis status.

### `resources\assets\js\components\modules\Tour.jsx`

**Tour** This component contains all of the tour steps and controls operation of the tour.
@see https://github.com/gilbarbara/react-joyride

Property | Type | Required | Description
:--- | :--- | :--- | :---
updateTourSelector|PropType func|yes|Callback used when the selector the tour is pointing to is changed. Takes the classname of the currently selected component as a parameter.
stopTour|PropType func|yes|Function that can be called to stop the tour.
tourRunning|PropType bool|yes|Boolean indicating whether the tour should be running or not.

### `resources\assets\js\components\modules\TreeViewFilter.jsx`

**TreeViewFilter** This component is used to provide users with the option of sorting the drugs in the 
galaxy view by various properties.

Property | Type | Required | Description
:--- | :--- | :--- | :---
onClickRadio|PropType func|yes|Function that can be called to sort the drugs in the Galaxy View. Takes a string parameter indicating what to sort by.

### `resources\assets\js\components\modules\UploadFAERS.jsx`

**UploadFAERS** This component is used to upload FAERS data zip files and show status information about the last analysis ran.

Property | Type | Required | Description
:--- | :--- | :--- | :---
status|PropType object|yes|The status of the last analysis ran.
getStatus|PropType func|yes|A function that can be called to get the updated analysis status.

