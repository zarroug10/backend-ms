const express = require('express');
const router = express.Router();
const incidentReportController = require('../Controllers/incidentReportController.js');

router.get('/incidents', incidentReportController.getIncidents);
router.get('/incidents/:id', incidentReportController.getIncidentById);
router.post('/submit', incidentReportController.submitIncident);
router.post('/submit-Report', incidentReportController.submitRepairReport);
router.get('/repair-Reports', incidentReportController.getrepaireReports);
router.get('/analytics/area',incidentReportController.getLocationAnalytics );
router.get('/analytics/status', incidentReportController.statusAnalytics);
router.get('/analytics/Reports', incidentReportController.getLocationReportsAnalytics);
   
module.exports = router; 