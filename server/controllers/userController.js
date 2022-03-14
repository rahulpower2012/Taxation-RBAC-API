const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { roles } = require('../roles')

async function hashPassword(password) {
    let hash =  await bcrypt.hash(password, 10);
    //     function (err, hash) {
    //     return hash;
    // });
    return hash
}

async function validatePassword(plainPassword, hashedPassword) {
    let verify = await bcrypt.compare(plainPassword, hashedPassword);
    //     function (err, result) {
    //     return result;
    // });
    return verify;
}

exports.grantAccess = function (action, resource) {
    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action"
                });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

exports.allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user)
            return res.status(401).json({
                error: "You need to be logged in to access this route"
            });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

exports.signup = async (req, res, next) => {
    try {
        const { role, email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ email, password: hashedPassword, role: role || "tax-p" });
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        newUser.accessToken = accessToken;
        await newUser.save();
        res.json({
            data: newUser,
            message: "You have signed up successfully"
        })
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return next(new Error('Email does not exist'));
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return next(new Error('Password is not correct'))
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        await User.findByIdAndUpdate(user._id, { accessToken })
        res.status(200).json({
            data: { email: user.email, role: user.role },
            accessToken
        })
    } catch (error) {
        next(error);
    }
}

exports.getUsers = async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
        data: users
    });
}

exports.getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if(user.role==="tax-p" && userId!=req.user._id){
            return res.status(401).json({
                error: "You don't have enough permission to perform this action"
            });
        }
        if (!user) return next(new Error('User does not exist'));
        res.status(200).json({
            data: user
        });
    } catch (error) {
        next(error)
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const { role } = req.body
        const userId = req.params.userId;
        await User.findByIdAndUpdate(userId, { role });
        const user = await User.findById(userId)
        res.status(200).json({
            data: user
        });
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            data: null,
            message: 'User has been deleted'
        });
    } catch (error) {
        next(error)
    }
}