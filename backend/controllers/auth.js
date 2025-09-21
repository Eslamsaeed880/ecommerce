import User from '../models/user.js';

import nodemailer from 'nodemailer';

import bcrypt from 'bcrypt';

import jwt from "jsonwebtoken";

import sendgridTransport from 'nodemailer-sendgrid-transport';
import { validationResult } from 'express-validator';

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.NODEMAILER_API_KEY
  }
}));



const postLogin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({message: errors.array()});
        }

        const { email, password } = req.body;
        const userExists = await User.findOne({email});

        const token = jwt.sign(
            {
                userId: userExists._id.toString()
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({message: "You logged in successfully.", token, userId: userExists._id.toString()});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: err.message})
    }
}

const postSignup = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({message: errors.array()});
        }
        
        const { firstName, lastName, email, password } = req.body;

        const userExists = await User.findOne({ email: email });

        if (!userExists) {
            const name = firstName.trim() + ' ' + lastName.trim();
            const saltRounds = parseInt(process.env.SALT_ROUNDS);
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = new User({ name, email, password: hashedPassword });

            await user.save();

            await transporter.sendMail({
                to: email,
                from: process.env.EMAIL_SENDER,
                subject: 'Signup succeeded!',
                html: '<h1>You successfully signed up!</h1>'
                }, (err, info) => {
                if(!err) {
                    console.log("Email Sent Successfully");
                }
            });

            return res.status(200).json({ message: "User Created successfully", user: user});
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({message: err.message})
    }
}

export default { postLogin, postSignup };