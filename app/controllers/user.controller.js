const db = require("../models");
var bcrypt = require("bcryptjs");
var sha1 = require('sha1');
const config = require("../config/auth.config");


const Op = db.Sequelize.Op;
const User = db.user;
const Role = db.role;


// Sign Up
exports.signup = async (req, res) => {
    let data = req.body;
    let fullname = data.fullname;
    let email = data.email;
    let phone = data.phone;
    let username = sha1(email) // hash email
    let password = data.password;
    let roles = data.roles;

    checkRoles();

    // Save User to Database  
    await User.create({
        username: username,
        fullname: fullname,
        email: email,
        phone: phone,
        password: bcrypt.hashSync(password, 8)
    })
        .then(user => {
            if (roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: [roles]
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.status(200).send({ message: "User was registered successfully!." });
                    });
                });
            } else {
                // The rol will be user -> 1
                user.setRoles([1]).then(() => {
                    res.status(200).send({ message: "User was registered successfully!." });
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });

};


function checkRoles() {
    let size = 0;

    Role.count().then(r => {
        size = parseInt(r);
        if (size === 0) {
            // Create roles
            Role.create({
                id: 1,
                name: config.rolAdmin
            });

            Role.create({
                id: 2,
                name: config.rolCustomer
            });
        } else {
            // Do something
        }
    })
}



// Public access
exports.allAccess = async (req, res) => {
    await res.status(200).send({ message: "Public Content." });
};




// get user by username
exports.getUserByUsername = async (req, res) => {
    let username = req.params.username;

    await User.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if (user) {
            res.status(200).send({
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
            });
        } else {
            res.status(404).send({ message: '¡No User was found!' });
        }

    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};



exports.updateAccount = async (req, res) => {
    let username = req.params.username;

    let data = req.body;
    let fullname = data.fullname;
    let email = data.email;
    let phone = data.phone;
    let new_username = sha1(email) // hash email


    try {
        await User.update({
            username: new_username,
            fullname: fullname,
            email: email,
            phone: phone
        }, {
            where: {
                username: username
            }
        });

        res.status(200).send({ message: "User was updated successfully." });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};



// Delete user in the table of users and roles.
exports.delete = async (req, res) => {
    let id = req.params.id;

    try {
        await User.destroy({
            where: {
                id: id
            }
        });
        res.status(200).send({ message: "User was deleted successfully." });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};



exports.adminBoard = async (req, res) => {
    // Get all users
    await User.findAll({ attributes: ['id', 'username', 'fullname', 'email', 'phone', 'createdAt'] })
        .then(users => {
            res.status(200).send(users);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        })
};