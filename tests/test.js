const express = require('express');
const fileParams = require('../index');
const supertest = require('supertest');

describe('Default settings', function () {
    const app = express();
    app.use(fileParams());
    app.get('/' , (req, res) => {
        res.sendFileParams('tests/test-def.html',
            {
                a: 'Hello',
                space: ' ',
                b: 'World'
            });
    });

    it('should replace parameters', async function () {
        const request = supertest(app);
        const res = await request.get('/');

        expect(res.text).toStrictEqual('<h1>Hello World</h1>');
    });
});

describe('Custom settings', function () {
    const app = express();
    app.use(fileParams({
        delimiter: ';'
    }));
    app.get('/' , (req, res) => {
        res.sendFileParams('tests/test-cus.html',
            {
                a: 'Hello',
                space: ' ',
                b: 'World'
            });
    });

    it('should replace parameters', async function () {
        const request = supertest(app);
        const res = await request.get('/');

        expect(res.text).toStrictEqual('<h1>Hello World</h1>');
    });
});

describe('Incorrect settings', function () {
    it('should throw error on not string delimiter', function () {
        expect(() => fileParams({delimiter: 43})).toThrowError();
    });
    it('should throw error on empty delimiter', function () {
        expect(() => fileParams({delimiter: ''})).toThrowError();
    });
    it('should throw error on too long delimiter', function () {
        expect(() => fileParams({delimiter: 'long'})).toThrowError();
    });
});