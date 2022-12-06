const express = require('express');
const { sso } = require('node-expose-sspi');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('trust proxy', true);
app.use(sso.auth());

app.use((req, res, next) => {
    let ip = req.ip;
    ip = ip.substring(ip.lastIndexOf(':') + 1);
    const origin = req.headers.origin;
    console.table([{ Timestamp: new Date().toLocaleString(), Method: req.method, Request: req.originalUrl, Origin: origin, Client: ip }]);
    
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    const allowedOrigins = ['http://localhost:4200', 'https://cobra.app.intel.com'];
    if(allowedOrigins.includes(origin)){
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.get('/',(req, res, next) => {
    console.log(req.sso.user.displayName);

    const user = {
        displayName: req.sso.user.displayName,
        domain: req.sso.user.domain,
        name: req.sso.user.name,
        wwid: req.sso.user.adUser.title
    };

    res.json({
        sso: req.sso.user,
        user
    });
});

app.listen(3000, () => console.log('Server started on port 3000'));