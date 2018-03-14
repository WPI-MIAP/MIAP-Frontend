## Constants

<dl>
<dt><a href="#loggerMiddleware">loggerMiddleware</a></dt>
<dd><p>Entry point of the React App</p>
</dd>
<dt><a href="#currentDrugs">currentDrugs</a></dt>
<dd><p>Fetch the drugs from the server and add to state object</p>
</dd>
<dt><a href="#selectDrug">selectDrug</a></dt>
<dd><p>Select a drug or remove the selected drug</p>
</dd>
<dt><a href="#selectMaxScore">selectMaxScore</a></dt>
<dd><p>Select the max score or set default to 2</p>
</dd>
<dt><a href="#selectMinScore">selectMinScore</a></dt>
<dd><p>Select the min score or set default to 2</p>
</dd>
<dt><a href="#selectRule">selectRule</a></dt>
<dd><p>Select a rule or remove the currently selected rule</p>
</dd>
<dt><a href="#treeViewSorting">treeViewSorting</a></dt>
<dd><p>Select the sorting method in the galaxy view</p>
</dd>
<dt><a href="#dmeColors">dmeColors</a></dt>
<dd><p>Colors and labels associated with different ranges of severe ADR counts</p>
</dd>
<dt><a href="#scoreColors">scoreColors</a></dt>
<dd><p>Colors and labels associated with different score ranges</p>
</dd>
<dt><a href="#scoreBorderColors">scoreBorderColors</a></dt>
<dd><p>Colors associated with node borders for different score ranges (used in Interaction Profile)</p>
</dd>
<dt><a href="#baseNodeColor">baseNodeColor</a></dt>
<dd><p>Color of base node in Interaction Profile (same as color of nodes in Overview).</p>
</dd>
<dt><a href="#baseNodeBorderColor">baseNodeBorderColor</a></dt>
<dd><p>Border color of base node in Interaction Profile.</p>
</dd>
<dt><a href="#severeADRColor">severeADRColor</a></dt>
<dd><p>Color of severe ADRs in Interaction Profile.</p>
</dd>
<dt><a href="#regularADRColor">regularADRColor</a></dt>
<dd><p>Color of non-severe ADRs in Interaction Profile.</p>
</dd>
<dt><a href="#barColor">barColor</a></dt>
<dd><p>Color of bars in barchart of Report View.</p>
</dd>
<dt><a href="#barSelectedColor">barSelectedColor</a></dt>
<dd><p>Color of selected bar in barchart of Report View.</p>
</dd>
<dt><a href="#selectedColor">selectedColor</a></dt>
<dd><p>Color used for bar indicating the selected tab.</p>
</dd>
<dt><a href="#primaryColor">primaryColor</a></dt>
<dd><p>Primary color of the application (used as background of toolbar among others).</p>
</dd>
<dt><a href="#secondaryColor">secondaryColor</a></dt>
<dd><p>Secondary color of the application (used by score distribution).</p>
</dd>
<dt><a href="#complementaryColor">complementaryColor</a></dt>
<dd><p>Color used for tabs, footer, etc.</p>
</dd>
<dt><a href="#wpiLogo">wpiLogo</a></dt>
<dd><p>WPI logo shown on left of toolbar.</p>
</dd>
<dt><a href="#teamPhoto">teamPhoto</a></dt>
<dd><p>Team picture found on About Us page.</p>
</dd>
<dt><a href="#medicines">medicines</a></dt>
<dd><p>Drug count icon for toolbar.</p>
</dd>
<dt><a href="#connection">connection</a></dt>
<dd><p>Interaction count icon for toolbar.</p>
</dd>
<dt><a href="#overviewName">overviewName</a></dt>
<dd><p>Display name for the view on the left (previously Overview).</p>
</dd>
<dt><a href="#galaxyViewName">galaxyViewName</a></dt>
<dd><p>Display name for the middle view (previously Galaxy View).</p>
</dd>
<dt><a href="#interactionProfileName">interactionProfileName</a></dt>
<dd><p>Display name for the view on the right (previously Interaction Profile).</p>
</dd>
<dt><a href="#generateColor">generateColor</a></dt>
<dd><p>Generate color based on score</p>
</dd>
<dt><a href="#generateScoreBorderColor">generateScoreBorderColor</a></dt>
<dd><p>Border colors of interaction profile nodes based on score</p>
</dd>
<dt><a href="#getStyleByDMECount">getStyleByDMECount</a></dt>
<dd><p>Get the style of the background of galaxy panels based on number of DMEs</p>
</dd>
<dt><a href="#countDrugInteraction">countDrugInteraction</a></dt>
<dd><p>Count number of drugs and interactions after applying filter</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#mapStateToProps">mapStateToProps()</a></dt>
<dd><p>This file is the container for the GlobalFilterNav</p>
</dd>
<dt><a href="#getIsFetching">getIsFetching()</a></dt>
<dd><p>Container for the MainView</p>
</dd>
<dt><a href="#mapStateToProps">mapStateToProps()</a></dt>
<dd><p>Container for the SearchBar</p>
</dd>
<dt><a href="#mapStateToProps">mapStateToProps()</a></dt>
<dd><p>Container for the TreeViewFilter</p>
</dd>
<dt><a href="#visibilityFilter">visibilityFilter(state, action)</a></dt>
<dd><p>Select the filtering method in overview</p>
</dd>
</dl>

<a name="loggerMiddleware"></a>

## loggerMiddleware
Entry point of the React App

**Kind**: global constant  
<a name="currentDrugs"></a>

## currentDrugs
Fetch the drugs from the server and add to state object

**Kind**: global constant  

| Param | Type |
| --- | --- |
| state |  | 
| action | <code>\*</code> | 

<a name="selectDrug"></a>

## selectDrug
Select a drug or remove the selected drug

**Kind**: global constant  

| Param | Type |
| --- | --- |
| state | <code>string</code> | 
| action |  | 

<a name="selectMaxScore"></a>

## selectMaxScore
Select the max score or set default to 2

**Kind**: global constant  

| Param | Type |
| --- | --- |
| state | <code>number</code> | 
| action | <code>\*</code> | 

<a name="selectMinScore"></a>

## selectMinScore
Select the min score or set default to 2

**Kind**: global constant  

| Param | Type |
| --- | --- |
| state | <code>number</code> | 
| action | <code>\*</code> | 

<a name="selectRule"></a>

## selectRule
Select a rule or remove the currently selected rule

**Kind**: global constant  

| Param | Type |
| --- | --- |
| state | <code>string</code> | 
| action | <code>\*</code> | 

<a name="treeViewSorting"></a>

## treeViewSorting
Select the sorting method in the galaxy view

**Kind**: global constant  

| Param | Type |
| --- | --- |
| state | <code>string</code> | 
| action | <code>\*</code> | 

<a name="dmeColors"></a>

## dmeColors
Colors and labels associated with different ranges of severe ADR counts

**Kind**: global constant  
<a name="scoreColors"></a>

## scoreColors
Colors and labels associated with different score ranges

**Kind**: global constant  
<a name="scoreBorderColors"></a>

## scoreBorderColors
Colors associated with node borders for different score ranges (used in Interaction Profile)

**Kind**: global constant  
<a name="baseNodeColor"></a>

## baseNodeColor
Color of base node in Interaction Profile (same as color of nodes in Overview).

**Kind**: global constant  
<a name="baseNodeBorderColor"></a>

## baseNodeBorderColor
Border color of base node in Interaction Profile.

**Kind**: global constant  
<a name="severeADRColor"></a>

## severeADRColor
Color of severe ADRs in Interaction Profile.

**Kind**: global constant  
<a name="regularADRColor"></a>

## regularADRColor
Color of non-severe ADRs in Interaction Profile.

**Kind**: global constant  
<a name="barColor"></a>

## barColor
Color of bars in barchart of Report View.

**Kind**: global constant  
<a name="barSelectedColor"></a>

## barSelectedColor
Color of selected bar in barchart of Report View.

**Kind**: global constant  
<a name="selectedColor"></a>

## selectedColor
Color used for bar indicating the selected tab.

**Kind**: global constant  
<a name="primaryColor"></a>

## primaryColor
Primary color of the application (used as background of toolbar among others).

**Kind**: global constant  
<a name="secondaryColor"></a>

## secondaryColor
Secondary color of the application (used by score distribution).

**Kind**: global constant  
<a name="complementaryColor"></a>

## complementaryColor
Color used for tabs, footer, etc.

**Kind**: global constant  
<a name="wpiLogo"></a>

## wpiLogo
WPI logo shown on left of toolbar.

**Kind**: global constant  
<a name="teamPhoto"></a>

## teamPhoto
Team picture found on About Us page.

**Kind**: global constant  
<a name="medicines"></a>

## medicines
Drug count icon for toolbar.

**Kind**: global constant  
<a name="connection"></a>

## connection
Interaction count icon for toolbar.

**Kind**: global constant  
<a name="overviewName"></a>

## overviewName
Display name for the view on the left (previously Overview).

**Kind**: global constant  
<a name="galaxyViewName"></a>

## galaxyViewName
Display name for the middle view (previously Galaxy View).

**Kind**: global constant  
<a name="interactionProfileName"></a>

## interactionProfileName
Display name for the view on the right (previously Interaction Profile).

**Kind**: global constant  
<a name="generateColor"></a>

## generateColor
Generate color based on score

**Kind**: global constant  

| Param | Type |
| --- | --- |
| score | <code>number</code> | 
| scoreRange | <code>array</code> | 

<a name="generateScoreBorderColor"></a>

## generateScoreBorderColor
Border colors of interaction profile nodes based on score

**Kind**: global constant  

| Param | Type |
| --- | --- |
| score | <code>number</code> | 
| scoreRange | <code>array</code> | 

<a name="getStyleByDMECount"></a>

## getStyleByDMECount
Get the style of the background of galaxy panels based on number of DMEs

**Kind**: global constant  

| Param | Type |
| --- | --- |
| numDMEs | <code>number</code> | 
| dmeRange | <code>array</code> | 

<a name="countDrugInteraction"></a>

## countDrugInteraction
Count number of drugs and interactions after applying filter

**Kind**: global constant  

| Param | Type |
| --- | --- |
| rules | <code>array</code> | 
| filter | <code>string</code> | 
| minScore | <code>number</code> | 
| maxScore | <code>number</code> | 

<a name="mapStateToProps"></a>

## mapStateToProps()
This file is the container for the GlobalFilterNav

**Kind**: global function  
<a name="getIsFetching"></a>

## getIsFetching()
Container for the MainView

**Kind**: global function  
<a name="mapStateToProps"></a>

## mapStateToProps()
Container for the SearchBar

**Kind**: global function  
<a name="mapStateToProps"></a>

## mapStateToProps()
Container for the TreeViewFilter

**Kind**: global function  
<a name="visibilityFilter"></a>

## visibilityFilter(state, action)
Select the filtering method in overview

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| state | <code>string</code> | <code>&quot;all&quot;</code> | 
| action | <code>\*</code> |  | 

