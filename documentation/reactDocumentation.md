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

**Report** 

### `resources\assets\js\components\modules\ReportChipContainer.jsx`

**ReportChipContainer** 

### `resources\assets\js\components\modules\SearchBarComponent.jsx`

**SearchBarComponent** 

### `resources\assets\js\components\modules\StatusInformation.jsx`

**StatusInformationButton** 
**StatusInformation** 

### `resources\assets\js\components\modules\Tour.jsx`

**Tour** This component contains all of the tour steps and controls operation of the tour.
@see https://github.com/gilbarbara/react-joyride

Property | Type | Required | Description
:--- | :--- | :--- | :---
updateTourSelector|PropType func|yes|Callback used when the selector the tour is pointing to is changed. Takes the classname of the currently selected component as a parameter.
stopTour|PropType func|yes|Function that can be called to stop the tour.
tourRunning|PropType bool|yes|Boolean indicating whether the tour should be running or not.

### `resources\assets\js\components\modules\TreeViewFilter.jsx`

**TreeViewFilter** 

### `resources\assets\js\components\modules\UploadFAERS.jsx`

**UploadFAERS** This component is used to upload FAERS data zip files and show status information about the last analysis ran.

Property | Type | Required | Description
:--- | :--- | :--- | :---
status|PropType object|yes|The status of the last analysis ran.
getStatus|PropType func|yes|A function that can be called to get the updated analysis status.

