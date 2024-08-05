const { response, request } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const generateJwt = require('../jwt/generate');

const AuthController = {
    login: async (req= request, res = response) => {
        try {
            const { email, password } = req.body;
            const userFound = await UserModel.findOne({ email });
            if (!userFound) {
                return res.status(400).json({
                    error: true,
                    message: 'Email or password incorrect'
                })
            }
            const validPassword = bcrypt.compareSync(password, userFound.password);
            if (!validPassword) {
                return res.status(400).json({
                    error: false,
                    message: 'Email or password incorrect'
                })
            }

            const payload = {
                id: userFound._id,
                name: userFound.name,
                email: userFound.email,
                role: userFound.role,
                identification: userFound.identification
            }

            const token = await generateJwt(payload)

        

            res.status(200).json({
                error: false,
                message: 'Login success',
                data: token
            
            })

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: 'Error in the server ' + error
            })
        }
    }
}

module.exports = AuthController