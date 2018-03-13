[TypeScript Documentation](../README.md) > ["server/csv/CSVController"](../modules/_server_csv_csvcontroller_.md) > [CSVController](../classes/_server_csv_csvcontroller_.csvcontroller.md)



# Class: CSVController


Controller class to handle different requests for this feature

## Index

### Methods

* [getDMEs](_server_csv_csvcontroller_.csvcontroller.md#getdmes)
* [getReports](_server_csv_csvcontroller_.csvcontroller.md#getreports)
* [getRules](_server_csv_csvcontroller_.csvcontroller.md#getrules)
* [getStatus](_server_csv_csvcontroller_.csvcontroller.md#getstatus)
* [uploadReports](_server_csv_csvcontroller_.csvcontroller.md#uploadreports)



---
## Methods
<a id="getdmes"></a>

###  getDMEs

► **getDMEs**(req: *`Request`*, res: *`Response`*, next: *`NextFunction`*): `Promise`.<`void`>



*Defined in server/csv/CSVController.ts:253*



Retrieve array of severe ADR names.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| req | `Request`   |  - |
| res | `Response`   |  - |
| next | `NextFunction`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="getreports"></a>

###  getReports

► **getReports**(req: *`Request`*, res: *`Response`*, next: *`NextFunction`*): `Promise`.<`void`>



*Defined in server/csv/CSVController.ts:164*



Retrieve array of reports for a given drug (req.query.drug) or interaction (req.query.drug1 and req.query.drug2).


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| req | `Request`   |  - |
| res | `Response`   |  - |
| next | `NextFunction`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="getrules"></a>

###  getRules

► **getRules**(req: *`Request`*, res: *`Response`*, next: *`NextFunction`*): `Promise`.<`void`>



*Defined in server/csv/CSVController.ts:51*



Get rules, drugs, as well as score and severe ADR count distributions in json.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| req | `Request`   |  - |
| res | `Response`   |  - |
| next | `NextFunction`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="getstatus"></a>

###  getStatus

► **getStatus**(req: *`Request`*, res: *`Response`*, next: *`NextFunction`*): `Promise`.<`void`>



*Defined in server/csv/CSVController.ts:237*



Retrieve status information in json.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| req | `Request`   |  - |
| res | `Response`   |  - |
| next | `NextFunction`   |  - |





**Returns:** `Promise`.<`void`>





___

<a id="uploadreports"></a>

###  uploadReports

► **uploadReports**(req: *`Request`*, res: *`Response`*, next: *`NextFunction`*): `Promise`.<`any`>



*Defined in server/csv/CSVController.ts:20*



Used to upload FAERS files to the server. Files are passed in as req.files.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| req | `Request`   |  - |
| res | `Response`   |  - |
| next | `NextFunction`   |  - |





**Returns:** `Promise`.<`any`>





___


