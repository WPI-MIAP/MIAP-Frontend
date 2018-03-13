[TypeScript Documentation](../README.md) > ["server/csv/CSVController"](../modules/_server_csv_csvcontroller_.md)



# External module: "server/csv/CSVController"

## Index

### Classes

* [CSVController](../classes/_server_csv_csvcontroller_.csvcontroller.md)


### Variables

* [exec](_server_csv_csvcontroller_.md#exec)


### Functions

* [csvToJson](_server_csv_csvcontroller_.md#csvtojson)
* [getDrugsFromRules](_server_csv_csvcontroller_.md#getdrugsfromrules)



---
## Variables
<a id="exec"></a>

###  exec

**●  exec**:  *`any`*  =  require('child_process').exec

*Defined in server/csv/CSVController.ts:6*





___


## Functions
<a id="csvtojson"></a>

###  csvToJson

► **csvToJson**(csv: *`any`*): `any`[]



*Defined in server/csv/CSVController.ts:269*



Convert a file in csv format to json.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| csv | `any`   |  file (in csv format) to convert |





**Returns:** `any`[]





___

<a id="getdrugsfromrules"></a>

###  getDrugsFromRules

► **getDrugsFromRules**(rules: *`any`*): `Object`[]



*Defined in server/csv/CSVController.ts:300*



Get array of all drugs (no duplicates) contained in the rules.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| rules | `any`   |  - |





**Returns:** `Object`[]





___


