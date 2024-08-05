const { request, response } = require("express");
const RecordModel = require('../models/record')
const UserModel = require('../models/user')
const XLSX = require('xlsx')

const RecordController = {
    getRecords: async (req = request, res = response) => {
        const { from, to, status, period, number_order } = req.query
        try {

            if (number_order !== 'undefined') {
                const records = await RecordModel.find({ NUMERO_DE_LA_ORDEN: number_order }).populate(['management'])

                if (!records) return res.status(400).json({ message: 'Error getting records', error: true })

                return res.status(200).json({
                    message: 'Records obtained successfully',
                    data: records,
                    error: false
                })
            }

            const records = await RecordModel.find({ status: status }).populate(['document', 'management'])

            const newRecords = records.filter((record, index) => {

                if (period != 'undefined') {

                    return record.period == period

                }
                return index >= from && index <= to
            })



            if (!records) return res.status(400).json({ message: 'Error getting records', error: true })

            return res.status(200).json({
                message: 'Records obtained successfully',
                data: newRecords,
                error: false
            })


        } catch (error) {
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            })

        }

    },

    getRecordsByStatus: async (req = request, res = response) => {
        try {
            const { status } = req.params
            const records = await RecordModel.find({ status }).populate(['document', 'management'])

            if (!records) return res.status(400).json({ message: 'Error getting records', error: true })

            return res.status(200).json({
                message: 'Records obtained successfully',
                data: records,
                error: false
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            })

        }
    },

    getOptionsForFilter: async (req = request, res = response) => {
        try {

            const body = req.body
            console.log(body)
            const options = {
                neighborhoods: new Set(),
                cycles: new Set(),
                operationalIndicators: new Set(),
                periods: new Set(),
                records: []
            }


            if(body.period == "" && body.neighborhood == "" && body.cycle == "" && body.operationalIndicator == ""){

                const records = await RecordModel.find({ status: 'not reviewed' }).select('period')
                if (!records) return res.status(400).json({ message: 'Error getting records', error: true })
                
                records.forEach(record => {
                    options.periods.add(record.period)
                })
            }

            if(body.period != "" && body.neighborhood == "" && body.cycle == "" && body.operationalIndicator == ""){
                const records = await RecordModel.find({ status: 'not reviewed', period: body.period }).select('DESCRIPCION_BARRIO')
                if (!records) return res.status(400).json({ message: 'Error getting records', error: true })
                
                records.forEach(record => {
                    options.periods.add(record.period)
                    options.neighborhoods.add(record['DESCRIPCION_BARRIO'])
                }
                )
            }

            if(body.period != "" && body.neighborhood != "" && body.cycle == "" && body.operationalIndicator == ""){
                const records = await RecordModel.find({ status: 'not reviewed', period: body.period, DESCRIPCION_BARRIO: body.neighborhood }).select('DESCRIPCION_CICLO')
                if (!records) return res.status(400).json({ message: 'Error getting records', error: true })

                records.forEach(record => {
                    options.periods.add(record.period)
                    options.neighborhoods.add(record['DESCRIPCION_BARRIO'])
                    options.cycles.add(record['DESCRIPCION_CICLO'])
                })
            }

            if(body.period != "" && body.neighborhood != "" && body.cycle != "" && body.operationalIndicator == ""){
                const records = await RecordModel.find({ status: 'not reviewed', period: body.period, DESCRIPCION_BARRIO: body.neighborhood, DESCRIPCION_CICLO: body.cycle }).select('NOMBRE_UNIDAD_OPERATIVA')
                if (!records) return res.status(400).json({ message: 'Error getting records', error: true })

                records.forEach(record => {
                    options.periods.add(record.period)
                    options.neighborhoods.add(record['DESCRIPCION_BARRIO'])
                    options.cycles.add(record['DESCRIPCION_CICLO'])
                    options.operationalIndicators.add(record['NOMBRE_UNIDAD_OPERATIVA'])
                })
            }

            if(body.period != "" && body.neighborhood != "" && body.cycle != "" && body.operationalIndicator != ""){
                const records = await RecordModel.find({ status: 'not reviewed', period: body.period, DESCRIPCION_BARRIO: body.neighborhood, DESCRIPCION_CICLO: body.cycle, NOMBRE_UNIDAD_OPERATIVA: body.operationalIndicator }).populate(['management'])
                if (!records) return res.status(400).json({ message: 'Error getting records', error: true })

                records.forEach(record => {
                    options.periods.add(record.period)
                    options.neighborhoods.add(record['DESCRIPCION_BARRIO'])
                    options.cycles.add(record['DESCRIPCION_CICLO'])
                    options.operationalIndicators.add(record['NOMBRE_UNIDAD_OPERATIVA'])
                    options.records.push(record)
                })
            }



            return res.status(200).json({
                message: 'Records obtained successfully',
                data: {
                    neighborhoods: Array.from(options.neighborhoods).sort(),
                    cycles: Array.from(options.cycles).sort(),
                    operationalIndicators: Array.from(options.operationalIndicators).sort(),
                    periods: Array.from(options.periods).sort(),
                    records: options.records
                },
                error: false
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            })
        }
    },
    


    getRecordsForAsign: async (req = request, res = response) => {
        try {
            const {period, neighborhood, cycle, operationalIndicator} = req.query
            const records = await RecordModel.find({ status: 'not reviewed', period: period, DESCRIPCION_BARRIO:neighborhood, DESCRIPCION_CICLO: cycle,NOMBRE_UNIDAD_OPERATIVA: operationalIndicator }).populate(['document', 'management'])

            if (!records) return res.status(400).json({ message: 'Error getting records', error: true })

            return res.status(200).json({
                message: 'Records obtained successfully',
                data: records,
                error: false
            })
            

        } catch (error) {
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            })
        }
    },



    getRecordsByManagement: async (req = request, res = response) => {

        try {
            const { managementId } = req.params
            const records = await RecordModel.find({ management: managementId, status: 'not reviewed' }).populate('document')
            if (!records) return res.status(400).json({ message: 'Error getting records', error: true })
            const newRecords = records.map(record => {
                record.minimum_fee = parseInt(record.minimum_fee)
                return record
            })


            return res.status(200).json({
                message: 'Records obtained successfully',
                data: newRecords,
                error: false
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            })

        }
    },

    asignRecord: async (req = request, res = response) => {
        try {
            const { recordId } = req.params
            const { managementId } = req.body
            const record = await RecordModel.findByIdAndUpdate(recordId, { management: managementId }, { new: true })

            if (!record) return res.status(400).json({ message: 'Error getting records', error: true })

            return res.status(200).json({
                message: 'Record assigned successfully',
                data: record,
                error: false
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            })

        }
    },

    bulkAllocation: async (req = request, res = response) => {
        try {

            const file = req.file

            
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded', error: true });
            }
            
            const workbook = XLSX.readFile(file.path);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const stream = XLSX.stream.to_json(sheet, { raw: true, });

            stream.on('data', async (chunk) => {
                try {
                    let management = await UserModel.findOne({
                        identification: chunk.document
                    })
                    const recordFoundByOrder = await RecordModel.findOneAndUpdate({ NUMERO_DE_LA_ORDEN: chunk.number }, { management: management.id }, { new: true })
                    
                    if (!recordFoundByOrder) {
                        return res.status(400).json({ message: 'Error updating record', error: true })
                    }

                } catch (error) {
                    console.log('Error processing chunk:', error);
                }
            })

            stream.on('end', async () => {
                return res.status(200).json({
                    message: 'Update records succesful',
                    error: false,
                    data: null
                })
            })

            stream.on('error', () => {
                return res.status(500).json({
                    message: 'Error proccessing chunk:' + error,
                    error: true
                })
            })
            
        } catch (error) {
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            })
            
        }
    },
    updateRecord: async (req = request, res = response) => {
        try {
            const { id } = req.params
            const data = req.body
            const record = await RecordModel.findByIdAndUpdate(id, data, { new: true })
            if (!record) return res.status(400).json({ message: 'Error updating record', error: true })
            return res.status(200).json({
                message: 'Record updated successfully',
                data: record,
                error: false
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            })
        }
    }



}

module.exports = RecordController