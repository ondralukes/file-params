# file-params
## Usage
Apply the package as a middleware to your express app
```
const fileParams = require('file-params');
const express = require('express');

const app = express();

app.use(fileParams({
    delimiter: ';'
}));
```
`delimiter` - Optional - Character used to denote params in files

Use the `sendFileParams(filename, params)` function
```
app.get('/', (req, res) => {
    res.sendFileParams('sample-file.html', {
        a: 'Hello',
        b: 'World!',
        space: ' '
    });
});
```

## Sample output
Input file
```
<h1>;a;;space;;b;</h1>
```

Code
```
const fileParams = require('file-params');
const express = require('express');

const app = express();

app.use(fileParams({
    delimiter: ';'
}));

app.get('/', (req, res) => {
    res.sendFileParams('sample-file.html', {
        a: 'Hello',
        b: 'World!',
        space: ' '
    });
});

app.listen(8080);
```

Response
```
<h1>Hello World!</h1>
```