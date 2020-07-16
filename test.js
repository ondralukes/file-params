const fileParams = require('./index');
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