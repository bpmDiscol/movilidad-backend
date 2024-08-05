const DocumentModel = require('../models/document')
const RecordsModel = require('../models/record')
const OptionsModel = require('../models/options')
const DocumentController = {
    getDocuments: async (req = request, res = response) => {
        try {
            const { type } = req.params
            const documents = await DocumentModel.find().populate('leader')
            if (!documents) return res.status(400).json({ message: 'Error getting documents', error: true })
            return res.status(200).json({
                message: 'Documents retrieved successfully',
                data: documents,
                error: false
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            })
        }
    },

    analyzeDocument: async (req = request, res = response) => {
        try {
            const { id } = req.params;
            const records = await RecordsModel.find({ document: id });
    
            if (!records || records.length === 0) {
                return res.status(400).json({ message: 'Error getting records', error: true });
            }
    
            const options = await OptionsModel.find();
            const updates = records.map(async (record) => {
                // Convertir todos los campos a enteros usando parseInt
                const DIAS_DEUDA_ASIGNACION = parseInt(record.DIAS_DEUDA_ASIGNACION);
                const CORRIENTE_NO_VENCIDA_ASIGNADA = parseInt(record.CORRIENTE_NO_VENCIDA_ASIGNADA);
                const CORRIENTE_VENCIDA_ASIGNADA = parseInt(record.CORRIENTE_VENCIDA_ASIGNADA);
    
                let percentage;
                if (DIAS_DEUDA_ASIGNACION + parseInt(options[4].value) >= 55 && DIAS_DEUDA_ASIGNACION + parseInt(options[4].value) <= 90) {
                    percentage = parseInt(options[0].value);
                } else if (DIAS_DEUDA_ASIGNACION + parseInt(options[4].value) >= 91 && DIAS_DEUDA_ASIGNACION + parseInt(options[4].value) <= 150) {
                    percentage = parseInt(options[1].value);
                } else if (DIAS_DEUDA_ASIGNACION + parseInt(options[4].value) >= 151) {
                    percentage = parseInt(options[2].value);
                } else if (DIAS_DEUDA_ASIGNACION === 0) {
                    percentage = parseInt(options[3].value);
                }
                if (!isNaN(CORRIENTE_NO_VENCIDA_ASIGNADA) && !isNaN(CORRIENTE_VENCIDA_ASIGNADA) && !isNaN(percentage)) {
                    const minimum_fee = (CORRIENTE_NO_VENCIDA_ASIGNADA + CORRIENTE_VENCIDA_ASIGNADA) * percentage / 100;
                    return RecordsModel.updateOne({ _id: record._id }, { minimum_fee: minimum_fee });
                    // Continuar con el resto del código
                } else {
                    // Manejar el caso en el que uno de los valores no sea numérico
                    console.error('One of the values is not a number.');
                }
    
            });
    
            await Promise.all(updates);
    
            await DocumentModel.updateOne({ _id: id }, { status: 'analyzed' });
    
            return res.status(200).json({
                message: 'Records updated successfully',
                error: false
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Error in the server ' + error.message,
                error: true
            });
        }
    }

}

module.exports = DocumentController