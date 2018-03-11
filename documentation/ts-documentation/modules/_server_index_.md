[TypeScript Documentation](../README.md) > ["server/index"](../modules/_server_index_.md)



# External module: "server/index"

## Index

### Variables

* [port](_server_index_.md#port)
* [server](_server_index_.md#server)


### Functions

* [normalizePort](_server_index_.md#normalizeport)
* [onError](_server_index_.md#onerror)
* [onListening](_server_index_.md#onlistening)



---
## Variables
<a id="port"></a>

### «Const» port

**●  port**:  *`string`⎮`number`⎮`true`⎮`false`*  =  normalizePort(process.env.PORT || 3000)

*Defined in server/index.ts:11*



Set default port to 3000.




___

<a id="server"></a>

### «Const» server

**●  server**:  *`Server`*  =  http.createServer(App)

*Defined in server/index.ts:17*



Configure server.




___


## Functions
<a id="normalizeport"></a>

###  normalizePort

► **normalizePort**(val: *`number`⎮`string`*): `number`⎮`string`⎮`boolean`



*Defined in server/index.ts:27*



Make sure port number is valid.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| val | `number`⎮`string`   |  port number |





**Returns:** `number`⎮`string`⎮`boolean`





___

<a id="onerror"></a>

###  onError

► **onError**(error: *`ErrnoException`*): `void`



*Defined in server/index.ts:43*



Log error output.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| error | `ErrnoException`   |  - |





**Returns:** `void`





___

<a id="onlistening"></a>

###  onListening

► **onListening**(): `void`



*Defined in server/index.ts:63*



Print the port that the server is listening on.




**Returns:** `void`





___


