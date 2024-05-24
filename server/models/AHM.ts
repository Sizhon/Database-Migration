import mongoose from 'mongoose';
import {
  validateCBO,
  validateEID,
  validateEmail,
  validateSeason,
} from '../utils/validators';
import { JWT } from 'google-auth-library';

const AHMModel = new mongoose.Schema(
  {
    eid: {
      type: Number,
      unique: true,
      validate: {
        validator: validateEID,
        message: `Not a valid employee id, it has to be 6 digits long`,
      },
    },
    JWT: {
      type: String,
      unique: true,
    },
    access_token: {
      type: String,
    },
    refresh_token: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    picture: {
      type: String,
      required: true,
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
    seasonsActive: {
      type: [
        {
          type: String,
          validate: {
            validator: validateSeason,
            message:
              'invalid season format. try YYYY Summer or YYYY-YYYY School Year',
          },
        },
      ],
    },
  },
  { timestamps: true },
);

const AHM = mongoose.model('AHM', AHMModel);

export default AHM;
