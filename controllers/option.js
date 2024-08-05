const { request, response } = require('express')
const OptionModel = require('../models/options')
const OptionController = {
    //create and update functions
    createOrUpdate: async (req = request, res = response) => {
        //crear la opcion si no existe y si existe actualizarla
        try {
            const arrayOptions = []
            
            for(const key in req.body){
                arrayOptions.push({key: key, value: req.body[key]})
            }
            console.log(arrayOptions)

            const optionsUpdated = []
            for (let i = 0; i < arrayOptions.length; i++) {
                console.log(arrayOptions[i])
                const option = arrayOptions[i]
                const optionUpdated = await OptionModel.findByIdAndUpdate(option.key , { value: option.value }, { new: true})
                optionsUpdated.push(optionUpdated)
            }
            return res.status(200).json({
                error: false,
                message: 'Options updated successfully',
                data: optionsUpdated
            })

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: 'Server error ' + error.message
            })
            
        }
    },

    getOptions: async (req = request, res = response) => {
        try {
            const options = await OptionModel.find()
            return res.status(200).json({
                error: false,
                message: 'Options fetched successfully',
                data: options
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: true,
                message: 'Server error'
            })
        }
    },


}

module.exports = OptionController