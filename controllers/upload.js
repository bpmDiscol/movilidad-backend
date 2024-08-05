const { request, response } = require("express");
const XLSX = require('xlsx')
const DocumentModel = require('../models/document')
const RecordsModel = require('../models/record')

const UploadController = {
    uploadDocument: async (req = request, res = response) => {
        try {
            const file = req.file;
            const document = req.body;

            if (!file) {
                return res.status(400).json({ message: 'No file uploaded', error: true });
            }

            const workbook = XLSX.readFile(file.path);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const stream = XLSX.stream.to_json(sheet, { raw: true, });
            let count = 0

            const documentCreated = await DocumentModel.create({
                ...document,
            })

            stream.on('data', async (chunk) => {
                try {

                    const element = {
                        ...chunk
                    }

                    const data = JSON.parse(JSON.stringify(element))

                    //modificar el encabezado de la tabla a todos los encabezados en los espacios colocar _
                    for (const key in data) {
                        //quitar tildes
                        let newKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                        //quitar espacios
                        newKey = newKey.replace(/\s/g, '_')

                        data[newKey] = data[key]
                        if (key !== newKey) {
                            delete data[key]
                        }
                    }



                    count += 1
                    await RecordsModel.create({
                        status: 'not reviewed',
                        period: document.period,
                        document: documentCreated._id,
                        ...data
                    })

                } catch (error) {
                    console.error('Error processing chunk:', error);


                }
            });

            stream.on('end', async () => {
                await DocumentModel.findByIdAndUpdate(documentCreated._id, { records: count });
                res.status(200).json({
                    message: 'File uploaded successfully',
                    data: documentCreated,
                    error: false,
                });
            })

            stream.on('error', (error) => {
                console.error('Error streaming file:', error);
                res.status(500).json({
                    message: 'Error uploading file',
                    error: error
                });
            })


        } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).json({
                message: 'Error uploading file',
                error: error
            });
        }
    }
}

module.exports = UploadController