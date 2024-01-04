import express from 'express';

const app = express();
const port = 3000;

function hello() {
    return 'Hello World!';
}

app.get('/', (req, res) => {
    res.send(hello());
});

var server = app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

export { server, hello }