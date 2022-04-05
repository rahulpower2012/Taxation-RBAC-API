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
        // newUser.accessToken = accessToken;
        await newUser.save();
        res.json({
            // data: {id: newUser._id, email: newUser.email, role: newUser.role},
            accessToken: accessToken,
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
        if (!user){
            return res.status(401.1).json({error: "User with this email does not exist"});
            // return next(new Error('Email does not exist'));
        }
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword){
            return res.status(401.1).json({error: "Password is incorrect"});
            // return next(new Error('Password is not correct'))
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        await User.findByIdAndUpdate(user._id, { accessToken })
        res.status(200).json({
            data: {
                userId: user._id, email: user.email, role: String(user.role).replace("-", ""),
                file: user.tax.taxFiled, paid: user.tax.taxPaid, tax: user.tax.taxAmount, due: user.tax.taxDueDate, calculated: user.tax.taxCalculated
            },
            accessToken
        })
    } catch (error) {
        next(error);
    }
}

exports.getUsers = async (req, res, next) => {
    const userId = req.params.userId;
    // const role = await User.findById(userId).select('role');
    const users = await User.find({ $or: [{role : "tax-p"}, {role: "tax-ac"}]}, {_id:1, email: 1, role: 1, tax:1});
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
            data: {
                userId: user._id, email: user.email, role: String(user.role).replace("-", ""),
                file: user.tax.taxFiled, paid: user.tax.taxPaid, tax: user.tax.taxAmount, due: user.tax.taxDueDate, calculated: user.tax.taxCalculated
            }
        })
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

exports.calculateTax = async (req, res, next) => {
    try {
        // const { income } = req.body
        const userId = req.params.userId;
        // await User.findByIdAndUpdate(userId, { $set:{"tax.income":income} });
        const user = await User.findById(userId);
        let {salary, stocks, other} = user.tax.income;
        tax = (salary + stocks + other) * 0.18;
        await User.findByIdAndUpdate(userId, { $set:{"tax.taxAmount":tax} });
        await User.findByIdAndUpdate(userId, { $set:{"tax.taxCalculated":true} });
        var myFutureDate=new Date();
        // myFutureDate.setDate(myFutureDate+ 30);
        await User.findByIdAndUpdate(userId, { $set:{"tax.taxDueDate":myFutureDate} });
        res.status(200).json({
            data: {
                tax: tax,
                dueDate: myFutureDate
            }
        });
    } catch (error) {
        next(error)
    }
}

exports.fileTax = async (req, res, next) => {
    try {
        const { income } = req.body
        const userId = req.params.userId;
        if(income.salary===0 && income.stocks===0 && income.other===0){
            return res.status(400).json({
                error: "Please enter income"
            });
        }
        else if(income.salary<0 || income.stocks<0 || income.other<0){
            return res.status(400).json({
                error: "Please enter proper income"
            });
        }
        else{{
        }
        await User.findByIdAndUpdate(userId, { $set:{"tax.income":income} });
        await User.findByIdAndUpdate(userId, { $set:{"tax.taxFiled":true} });
        const user = await User.findById(userId)
        res.status(200).json({
            data: user
        });
    }
    } catch (error) {
        next(error)
    }
}

exports.payTax = async (req, res, next) => {
    try {
        const { amount } = req.body
        const userId = req.params.userId;
        if(amount>0){
        await User.findByIdAndUpdate(userId, { $set:{"tax.taxPaid":true} });
            res.status(200).json({
                data: {paid : true}
            });
        }
        // await User.findByIdAndUpdate(userId, { $set:{"tax.taxFiled":true} });
        // const user = await User.findById(userId)
    } catch (error) {
        next(error)
    }
}