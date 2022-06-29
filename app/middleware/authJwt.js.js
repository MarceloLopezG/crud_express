const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;


verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).json({
            message: "No token provided!"
        });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};


isAdminRole = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            let roleAdm = undefined;
            try {
                roleAdm = roles[0].name;
            } catch (error) {
                res.status(400).send({ message: 'The user does not have any Role set.' });
                return;
            }

            if (roleAdm === config.rolAdmin) {
                next();
                return;
            } else {
                res.status(403).send({
                    message: "Require Admin Role!"
                });
                return;
            }
        });
    });
};


isCustomerRole = (req, res, next) => {
    try {
        User.findByPk(req.userId).then(user => {
            user.getRoles().then(roles => {
                let roleCust = undefined;
                try {
                    roleCust = roles[0].name;
                } catch (error) {
                    res.status(400).send({ message: 'The user does not have any Role set.' });
                }


                if (roleCust === config.rolCustomer) {
                    next();
                    return;
                } else {
                    res.status(403).send({
                        message: "Require user Role!"
                    });
                    return;
                }
            });
        });
    } catch (error) {
        res.status(400).send({ message: err.message });
    }

};


const authJwt = {
    verifyToken: verifyToken,
    isAdminRole: isAdminRole,
    isCustomerRole: isCustomerRole
};



module.exports = authJwt;