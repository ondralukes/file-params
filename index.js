const fs = require('fs');

function getParamValue(params, name){
    return params[name];
}

module.exports = (options) => {
    let delimiter = '`';
    if(typeof options !== 'undefined') {
        if (typeof options.delimiter === 'string') {
            if (options.delimiter.length !== 1) {
                throw Error('Delimiter must be 1 character long.');
            }
            delimiter = options.delimiter;
        } else if (typeof options.delimiter !== 'undefined') {
            throw Error('Delimiter must be string.')
        }
    }
    return (req, res, next) => {
        res.sendFileParams = (filename, params) => {
            const stream = fs.createReadStream(filename);

            let trailing = null;
            stream.on('data', (buffer) => {
                const chunk = buffer.toString();

                const delimiterIndexes = [];
                let index = -1;
                while((index = chunk.indexOf(delimiter, index + 1)) !== -1){
                    delimiterIndexes.push(index);
                }

                let pos = 0;
                if(trailing !== null){
                    const end = delimiterIndexes.shift();
                    const name = trailing + chunk.substring(0, end);

                    res.write(getParamValue(params, name));
                    trailing = null;
                    pos = end + 1;
                }

                while(delimiterIndexes.length >= 2){
                    const start = delimiterIndexes.shift();
                    const end = delimiterIndexes.shift();

                    const name = chunk.substring(start+1, end);

                    res.write(chunk.substring(pos, start));
                    res.write(getParamValue(params, name));
                    pos = end + 1;
                }

                if(delimiterIndexes.length !== 0){
                    const start = delimiterIndexes.shift();
                    res.write(chunk.substring(pos, start));
                    trailing = chunk.substring(start+1);
                } else {
                    res.write(chunk.substring(pos));
                }
            });

            stream.on('error', (err) => {
                throw err;
            });

            stream.on('end', () => {
                res.end();
            });
        }
        next();
    }
}