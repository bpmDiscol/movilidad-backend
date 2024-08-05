const { request, response } = require("express");
const UserModel = require("../models/user");
const bcrypt = require('bcrypt')



const UserController = {
    //CRUD user
    create: async (req=request, res = response) => {
        try {

            const user = req.body
            const salt = bcrypt.genSaltSync(10)
            user.password = bcrypt.hashSync(user.password, salt)
            const newUser = await UserModel.create(user)
            if (!newUser) return res.status(400).json({ message: 'Error creating user', error: true })
            return res.status(200).json({
                message: 'User created successfully',
                user: newUser,
                error: false
            })
            
        } catch (error) {
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            })
        }
    },

    getUsers: async (req=request, res = response) => {
        try {

            const users = await UserModel.find()
            if (!users) return res.status(400).json({ message: 'Error getting users', error: true })
            return res.status(200).json({
                message: 'Users obtained successfully',
                users,
                error: false
            })
            
        } catch (error) {
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            })
        }
    },

    getUsersByRole: async (req=request, res = response) => {
        try {

            const { role } = req.params
            const users = await UserModel.find({ role })
            if (!users) return res.status(400).json({ message: 'Error getting users', error: true })
            return res.status(200).json({
                message: 'Users obtained successfully',
                data: users,
                error: false
            })
            
        } catch (error) {
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            })
        }
    },

    delete: async(req=request, res = response) => {
        try {

            const { id } = req.params
            const user = await UserModel.findByIdAndDelete(id)
            if (!user) return res.status(400).json({ message: 'Error deleting user', error: true })
            return res.status(200).json({
                message: 'User deleted successfully',
                user,
                error: false
            })
            
        } catch (error) {
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            })
        }
    },


}

module.exports = UserController