const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>My practice project</title></head>');
        res.write('<body>');
        res.write('<form action="/message" method="POST">');
        res.write('<input type="text" name="input">')
        res.write('<button type="submit">Send</button>')
        res.write('</form>');
        res.write('</body>');
        res.write('</html>');

        return res.end();
    }

    if (url === '/message' && method === 'POST') {
        const body = [];

        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];

            fs.writeFileSync('practice.txt', message, (error) => {
                res.writeHead(302, { 'Location': '/' });
                res.end();
            });
        });

    }
    res.setHeader('Content-type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My practice project</title></head>');
    res.write('<body>');
    res.write('<h1>This is the else case</h1>');
    res.write('</body>');
    res.write('</html>');
    res.end();
}

module.exports={
    'handler':requestHandler
}