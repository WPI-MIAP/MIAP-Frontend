### `resources\assets\js\components\App.jsx`

**App** This is the main component for the application. It contains the Tour, GlobalFilterNavContainer, MainviewContainer, and Footer components.

### `resources\assets\js\components\layouts\DndTreeContainer.jsx`

**DndTreeContainer** This component creates the windows for each of the current drugs displayed in the Galaxy View.

Property | Type | Required | Description
:--- | :--- | :--- | :---
currentDrugs|PropType array|yes|Array of drugs currently in the Galaxy View.
selectedDrug|PropType string|yes|Name of the currently selected drug.
scoreRange|PropType array|yes|Array of score boundaries, indicating how to color nodes/edges based on score.
dmeRange|PropType array|yes|Array of severe ADR count boundaries, indicating how to color galaxy view headers.
filter|PropType string||Can be &#x27;all&#x27;, &#x27;known&#x27;, or &#x27;unkown&#x27;. Corresponds to filtering interactions by known/unknown.
minScore|PropType number||Minimum score for filtering interactions.
maxScore|PropType number||Maximum score for filtering interactions.
onClickNode|PropType func||Callback used when a node is clicked. Takes the node as a parameter.
onClickEdge|PropType func||Callback used when a edge is clicked. Takes the edge as a parameter.
onDeleteNode|PropType func||Callback used when a drug is removed from the galaxy view. Takes the drug name as a parameter.
onClearDrug|PropType func||Clears the selectedDrug.
cols|PropType number||Number of columns currently being displayed in Mainview (4 if all views visible or 12 if one is fullscreened).
handleOpen|PropType func||Used to open the reports view. Takes a report object containing information about the drug for which to retrieve reports.
helpExample|PropType bool||Indicates whether this is the version found in the help menu (defaults to false).

### `resources\assets\js\components\layouts\GlobalFilterNav.jsx`

**GlobalFilterNav** This component renders the navbar, combining the filters, upload button, help button, and search bar.

Property | Type | Required | Description
:--- | :--- | :--- | :---
rules|PropType array|yes|Array of rules representing all interaction between pairs of drugs in the visualization.
updating|PropType bool|yes|Indicates whether filters are currently being applied.
scoreRange|PropType array|yes|Array of score boundaries, indicating how to color nodes/edges based on score.
dmeRange|PropType array|yes|Array of severe ADR count boundaries, indicating how to color galaxy view headers.
minScore|PropType number|yes|Minimum score for filtering interactions.
maxScore|PropType number|yes|Maximum score for filtering interactions.
filter|PropType string|yes|Can be &#x27;all&#x27;, &#x27;known&#x27;, or &#x27;unkown&#x27;. Corresponds to filtering interactions by known/unknown.
status|PropType object|yes|Contains information about the status of the last MARAS analysis ran.
onClick|PropType func|yes|Used to apply the known/unknown filter. Takes the value of the selected option (&#x27;all&#x27;, &#x27;known&#x27;, or &#x27;unknown&#x27;).
updateMinScore|PropType func|yes|Used to set the new minimum score. Takes the new minimum score (a number) as a paramter.
updateMaxScore|PropType func|yes|Used to set the new maximum score. Takes the new maximum score (a number) as a paramter.
isUpdating|PropType func|yes|Used to indicate that the visualization is updating as a new filter has been applied. Takes a boolean indicating whether updating is in progress.
getStatus|PropType func|yes|A function that can be called to get the updated analysis status.

### `resources\assets\js\components\layouts\MainView.jsx`

**MainView** This component combines the ReportChipContainer, Overview, Galaxy View, Interaction Profile and Report View.

Property | Type | Required | Description
:--- | :--- | :--- | :---
isFetching|PropType bool|yes|Indicates whether the data is still being fetched for the nodes and links.
links|PropType array|yes|Array of links representing all interaction between pairs of drugs in the visualization.
nodes|PropType array|yes|Array of nodes representing all drugs in the visualization.
currentDrugs|PropType array|yes|Array of drugs currently in the Galaxy View.
selectedDrug|PropType string|yes|Name of the currently selected drug.
selectedRule|PropType string|yes|Name of the currently selected rule (of format: drug_1 --- drug_2).
filter|PropType string|yes|Can be &#x27;all&#x27;, &#x27;known&#x27;, or &#x27;unkown&#x27;. Corresponds to filtering interactions by known/unknown.
minScore|PropType number|yes|Minimum score for filtering interactions.
maxScore|PropType number|yes|Maximum score for filtering interactions.
scoreRange|PropType array|yes|Array of score boundaries, indicating how to color nodes/edges based on score.
dmeRange|PropType array|yes|Array of severe ADR count boundaries, indicating how to color galaxy view headers.
status|PropType object|yes|Contains information about the status of the last MARAS analysis ran.
onClickNode|PropType func|yes|Callback used when a node is clicked. Takes the node as a parameter.
onClickEdge|PropType func|yes|Callback used when an edge is clicked. Takes the edge as a parameter.
showDetailNode|PropType func|yes|Callback used when a node is clicked (Galaxy View). Takes the node as a parameter.
deleteNode|PropType func|yes|Callback used when a drug is removed from the galaxy view. Takes the drug name as a parameter.
isUpdating|PropType func|yes|Used to indicate that the visualization is updating as a new filter has been applied. Takes a boolean indicating whether updating is in progress.
clearRule|PropType func|yes|Remove the currently selected rule from the Interaction Profile.
clearSearchTerm|PropType func|yes|Remove the currently selected drug from the Interaction Profile.
getStatus|PropType func|yes|Used to get updated information about the status of the last MARAS analysis ran.

### `resources\assets\js\components\modules\D3Tree.jsx`

**D3Tree** This component renders the tree seen in the Profile View. This component should not be used directly. Instead, use InteractionProfile.

Property | Type | Required | Description
:--- | :--- | :--- | :---
scoreRange|PropType array|yes|Array of score boundaries, indicating how to color nodes/edges based on score.
treeData|PropType object|yes|Information about how to structure the tree.
filter|PropType string|yes|Can be &#x27;all&#x27;, &#x27;known&#x27;, or &#x27;unkown&#x27;. Corresponds to filtering interactions by known/unknown.
minScore|PropType number|yes|Minimum score for filtering interactions.
maxScore|PropType number|yes|Maximum score for filtering interactions.
width|PropType number|yes|Width of the parent node.
height|PropType number|yes|Height of the parent node.

### `resources\assets\js\components\modules\DistributionRangeSlider.jsx`

**DistributionRangeSlider** This component shows a distribution of the scores of all links over a range slider used to filter by score.

Property | Type | Required | Description
:--- | :--- | :--- | :---
rules|PropType array|yes|Array of rules representing all interaction between pairs of drugs in the visualization.
updateMinScore|PropType func||Used to set the new minimum score. Takes the new minimum score (a number) as a paramter.
updateMaxScore|PropType func||Used to set the new maximum score. Takes the new maximum score (a number) as a paramter.
isUpdating|PropType func||Used to indicate that the visualization is updating as a new filter has been applied. Takes a boolean indicating whether updating is in progress.
helpExample|PropType bool||Indicates whether this is the version found in the help menu (defaults to false).

### `resources\assets\js\components\modules\DndGraph.jsx`

**DndGraph** This component renders the graph seen in the Overview.

Property | Type | Required | Description
:--- | :--- | :--- | :---
nodes|PropType array|yes|Array of nodes representing all drugs in the visualization.
links|PropType array|yes|Array of links representing all interaction between pairs of drugs in the visualization.
width|PropType number|yes|Width of the browser window.
height|PropType number|yes|Height of the browser window.
selectedDrug|PropType string||Name of the currently selected drug.
onClickNode|PropType func||Callback used when a node is clicked. Takes the node as a parameter.
onClickEdge|PropType func||Callback used when an edge is clicked. Takes the edge as a parameter.
isFetching|PropType bool||Indicates whether the data is still being fetched for the nodes and links.
filter|PropType string||Can be &#x27;all&#x27;, &#x27;known&#x27;, or &#x27;unkown&#x27;. Corresponds to filtering interactions by known/unknown.
minScore|PropType number||Minimum score for filtering interactions.
maxScore|PropType number||Maximum score for filtering interactions.
isUpdating|PropType func||Used to indicate that the visualization is updating as a new filter has been applied. Takes a boolean indicating whether updating is in progress.
scoreRange|PropType array|yes|Array of score boundaries, indicating how to color nodes/edges based on score.

### `resources\assets\js\components\modules\DndTree.jsx`

**DndTree** This component controls and renders a single galaxy view inside of a DndTreeContainer.

Property | Type | Required | Description
:--- | :--- | :--- | :---
scoreRange|PropType array|yes|Array of score boundaries, indicating how to color nodes/edges based on score.
helpExample|PropType bool||Indicates whether this is the version found in the help menu (defaults to false).
currentDrug|PropType string|yes|Name of the central drug.
data|PropType object|yes|Contains information such as rules that allow for rendering the graph.
filter|PropType string||Can be &#x27;all&#x27;, &#x27;known&#x27;, or &#x27;unkown&#x27;. Corresponds to filtering interactions by known/unknown.
minScore|PropType number||Minimum score for filtering interactions.
maxScore|PropType number||Maximum score for filtering interactions.
onClickEdge|PropType func||Callback used when an edge is clicked. Takes the edge as a parameter.

### `resources\assets\js\components\modules\Footer.jsx`

**Footer** This component defines the footer shown fixed at the bottom of the page.

### `resources\assets\js\components\modules\GalaxyView.jsx`

**GalaxyView** This component renders the Galaxy View.

Property | Type | Required | Description
:--- | :--- | :--- | :---
col|PropType number|yes|Number of columns currently being displayed in Mainview (4 if all views visible or 12 if one is fullscreened).
toggleFullscreenGalaxy|PropType func|yes|Function that fullscreens the Galaxy View.
currentDrugs|PropType array|yes|Array of drugs currently in the Galaxy View.
filter|PropType string|yes|Can be &#x27;all&#x27;, &#x27;known&#x27;, or &#x27;unkown&#x27;. Corresponds to filtering interactions by known/unknown.
minScore|PropType number|yes|Minimum score for filtering interactions.
maxScore|PropType number|yes|Maximum score for filtering interactions.
width|PropType number|yes|Width of the browser window.
height|PropType number|yes|Height of the browser window.
onClickNode|PropType func|yes|Callback used when a node is clicked. Takes the node as a parameter.
onClickEdge|PropType func|yes|Callback used when a edge is clicked. Takes the edge as a parameter.
onDeleteNode|PropType func|yes|Callback used when a drug is removed from the galaxy view. Takes the drug name as a parameter.
onClearDrug|PropType func|yes|Clears the selectedDrug.
handleOpen|PropType func|yes|Used to open the reports view. Takes a report object containing information about the drug for which to retrieve reports.
scoreRange|PropType array|yes|Array of score boundaries, indicating how to color nodes/edges based on score.
dmeRange|PropType array|yes|Array of severe ADR count boundaries, indicating how to color galaxy view headers.
isGalaxyFullscreen|PropType bool|yes|Indicates whether the Galaxy View is currently fullscreened.
selectedDrug|PropType string|yes|Name of the currently selected drug.

### `resources\assets\js\components\modules\Help.jsx`

**Help** This component renders and controls the help menu.

Property | Type | Required | Description
:--- | :--- | :--- | :---
scoreRange|PropType array|yes|Array of score boundaries, indicating how to color nodes/edges based on score.
dmeRange|PropType array|yes|Array of severe ADR count boundaries, indicating how to color galaxy view headers.
startTour|PropType func|yes|Used to start the tour.
rules|PropType array|yes|Array of all rules in the visualization

### `resources\assets\js\components\modules\InteractionProfile.jsx`

**InteractionProfile** This component is a wrapper for the D3Tree component. It controls what nodes/links are passed to the D3Tree, applying all filters.

Property | Type | Required | Description
:--- | :--- | :--- | :---
helpExample|PropType bool||Indicates whether this is the version found in the help menu (defaults to false).
scoreRange|PropType array|yes|Array of score boundaries, indicating how to color nodes/edges based on score.
mainDrug|PropType string||Name of the currently selected drug.
mainRule|PropType string||Name of the currently selected rule (of format: drug_1 --- drug_2).
filter|PropType string||Can be &#x27;all&#x27;, &#x27;known&#x27;, or &#x27;unkown&#x27;. Corresponds to filtering interactions by known/unknown.
minScore|PropType number||Minimum score for filtering interactions.
maxScore|PropType number||Maximum score for filtering interactions.

### `resources\assets\js\components\modules\KnownUnknownDropDown.jsx`

**KnownUnknownDropDown** This component controls and renders the filter for selecting all rules, only known rules, or only unknown rules.

Property | Type | Required | Description
:--- | :--- | :--- | :---
isUpdating|PropType func|yes|Used to indicate that the visualization is updating as a new filter has been applied. Takes a boolean indicating whether updating is in progress.
onClick|PropType func|yes|Used to apply the known/unknown filter. Takes the value of the selected option (&#x27;all&#x27;, &#x27;known&#x27;, or &#x27;unknown&#x27;).

### `resources\assets\js\components\modules\Overview.jsx`

**Overview** This component controls and renders the Overview.

Property | Type | Required | Description
:--- | :--- | :--- | :---
col|PropType number|yes|Number of columns currently being displayed in Mainview (4 if all views visible or 12 if one is fullscreened).
toggleFullscreenOverview|PropType func|yes|Function that fullscreens the Overview.
onClickNode|PropType func|yes|Callback used when a node is clicked. Takes the node as a parameter.
onClickEdge|PropType func|yes|Callback used when an edge is clicked. Takes the edge as a parameter.
currentSelector|PropType string|yes|Class name of the component the tour is currently looking at.
nodes|PropType array|yes|Array of nodes representing all drugs in the visualization.
links|PropType array|yes|Array of links representing all interaction between pairs of drugs in the visualization.
width|PropType number|yes|Width of the browser window.
height|PropType number|yes|Height of the browser window.
selectedDrug|PropType string|yes|Name of the currently selected drug.
isFetching|PropType bool|yes|Indicates whether the data is still being fetched for the nodes and links.
filter|PropType string|yes|Can be &#x27;all&#x27;, &#x27;known&#x27;, or &#x27;unkown&#x27;. Corresponds to filtering interactions by known/unknown.
minScore|PropType number|yes|Minimum score for filtering interactions.
maxScore|PropType number|yes|Maximum score for filtering interactions.
isUpdating|PropType func|yes|Used to indicate that the visualization is updating as a new filter has been applied. Takes a boolean indicating whether updating is in progress.
scoreRange|PropType array|yes|Array of score boundaries, indicating how to color nodes/edges based on score.
nextTourStep|PropType func|yes|Advances the tour to the next step.
isOverviewFullscreen|PropType bool|yes|Indicates whether the Overview is currently fullscreened.
status|PropType object|yes|Contains information about the status of the last MARAS analysis ran.
getStatus|PropType func|yes|Used to get updated information about the status of the last MARAS analysis ran.

### `resources\assets\js\components\modules\ProfileView.jsx`

**ProfileView** This component is used to render the Interaction Profile View.

Property | Type | Required | Description
:--- | :--- | :--- | :---
col|PropType number|yes|Number of columns currently being displayed in Mainview (4 if all views visible or 12 if one is fullscreened).
toggleFullscreenProfile|PropType func|yes|Function that fullscreens the Profile View.
selectedDrug|PropType string|yes|Name of the currently selected drug.
selectedRule|PropType string|yes|Name of the currently selected rule (of format: drug_1 --- drug_2).
scoreRange|PropType array|yes|Array of score boundaries, indicating how to color nodes/edges based on score.
filter|PropType string|yes|Can be &#x27;all&#x27;, &#x27;known&#x27;, or &#x27;unkown&#x27;. Corresponds to filtering interactions by known/unknown.
minScore|PropType number|yes|Minimum score for filtering interactions.
maxScore|PropType number|yes|Maximum score for filtering interactions.
isProfileFullscreen|PropType bool|yes|Indicates whether this view is fullscreened or not.
profileTitle|PropType string|yes|Used as the title for this view.

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

