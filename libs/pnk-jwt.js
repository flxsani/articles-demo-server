const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = "SaniKumarYadav";
class PnkJwt {
    constructor() {

    }
    authenticateToken(req, res, next) {
        // Gather the jwt access token from the request header
        // console.log("TokenSecret:::", ACCESS_TOKEN_SECRET);
        //console.log("Request:::", req.headers);
        const authHeader = req.headers['authorization']
        // const token = authHeader && authHeader.split(' ')[1]
        const token = authHeader
        //console.log("Tokken::::", authHeader);
        // if (token == null) return res.sendStatus(401) // if there isn't any token
        if (token == null) 
        return res.status(401).send({
            status: false,
            message: "Unauthorized!"
        }); // if there isn't any token

        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            console.log(err)
            // if (err) return res.sendStatus(403)
            if (err) return res.status(401).send({
                status: false,
                message: "Token expired please login again!"
            });
            req.user = user
            next() // pass the execution off to whatever request the client intended
        })
    }

    generateAccessToken(username) {
        // expires after half and hour (1800 seconds = 30 minutes)
        return jwt.sign(username, ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
    }
    decodeToken(token) {
        // expires after half and hour (1800 seconds = 30 minutes)
        return  jwt.decode(token, { complete: true })
    }

}

const PnkJwtService = new PnkJwt();
export default PnkJwtService;