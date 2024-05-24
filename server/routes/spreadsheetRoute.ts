import express from 'express';
import {
  grabAdminCentralRoster,
  grabCBOList,
} from '../controllers/spreadsheetController';
import {
  assignAHMtoEmployee,
  populateEmployees,
} from '../controllers/employeeController';
import { populateCBOs } from '../controllers/siteController';

const spreadSheetRouter = express.Router();

//localhost:8000/api/sheets
spreadSheetRouter
  .route('/adminModule')
  .get(grabAdminCentralRoster, populateEmployees, assignAHMtoEmployee);

spreadSheetRouter.route('/cboList').get(grabCBOList, populateCBOs);

export default spreadSheetRouter;
