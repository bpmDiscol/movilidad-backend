const express = require('express')
const RecordController = require('../controllers/record')
const verifyToken = require('../jwt/verify')
const upload = require('../config/multer')
const router = express.Router()

router.get('/', verifyToken, RecordController.getRecords)
router.get('/management/:managementId', verifyToken, RecordController.getRecordsByManagement)
router.put('/asign/:recordId', verifyToken, RecordController.asignRecord)
router.put('/:id', verifyToken, RecordController.updateRecord)
router.put('/status/:status', verifyToken, RecordController.getRecordsByStatus)
router.get('/asign', verifyToken, RecordController.getRecordsForAsign)
router.post('/filters', verifyToken, RecordController.getOptionsForFilter)
router.post('/bulkAllocation',  upload.single('file'), verifyToken, RecordController.bulkAllocation)

module.exports = router