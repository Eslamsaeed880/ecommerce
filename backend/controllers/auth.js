import User from '../models/user.js';

import bcrypt from 'bcrypt';

import jwt from "jsonwebtoken";

const postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userExists = await User.findOne({email});

        if(!userExists) {
            return res.status(400).json({message: "This user doesn't exist"});
        } 

        const match = await bcrypt.compare(password, userExists.password);

        if(!match) {
            return res.status(400).json({message: "Invalid Inputs"});
        }

        const token = jwt.sign(
            {
                userId: userExists._id.toString(), 
                email: userExists.email
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
        const { firstName, lastName, email, password } = req.body;

        const userExists = await User.findOne({ email: email });

        if (!userExists) {
            const name = firstName.trim() + ' ' + lastName.trim();
            const saltRounds = parseInt(process.env.SALT_ROUNDS);
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = new User({ name, email, password: hashedPassword });

            await user.save();

            return res.status(200).json({ message: "User Created successfully", user: user});
        }

        res.status(400).json({message: "User already exists"});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: err.message})
    }
}

export default {postLogin, postSignup};