import mongoose from 'mongoose';
import {
  validateCBO,
  validateEID,
  validateEmail,
  validateSeason,
} from '../utils/validators';
import { JWT } from 'google-auth-library';

const employeeModel = new mongoose.Schema(
  {
    eid: {
      type: String,
      unique: true,
      validate: {
        validator: validateEID,
        message: `Not a valid employee id, it has to be 6 digits long`,
      },
    },
    name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    firstName: {
      type: String,
      min: 2,
      max: 50,
      trim: true,
    },
    preferredName: {
      type: String,
      min: 2,
      max: 50,
      trim: true,
    },
    lastName: {
      type: String,
      min: 2,
      max: 50,
      trim: true,
    },
    picture: {
      type: String,
    },
    email: {
      type: String,
      required: false,
      validate: {
        validator: validateEmail,
        message: `Not a valid email`,
      },
    },
    locationCode: {
      type: String,
      require: true,
      validate: {
        validator: validateCBO,
        message: 'location code invalid',
      },
    },
    siteName: {
      type: String,
      require: true,
    },
    isLeader: Boolean,
    ahmAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
    season: {
      type: String,
      validate: {
        validator: validateSeason,
        message:
          'invalid season format. try YYYY Summer or YYYY-YYYY School Year',
      },
    },
  },
  { timestamps: true },
);

const Employee = mongoose.model('Employee', employeeModel);

export default Employee;
