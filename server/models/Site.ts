import mongoose from 'mongoose';
import {
  validateCBO,
  validateEmail,
  validateSeason,
} from '../utils/validators';

const siteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  neighborhood: String,
  locationCode: {
    type: String,
    required: true,
    validate: {
      validator: validateCBO,
      message:
        'Not a valid CBO code format, example of valid location code: BYF230',
    },
  },
  poc: {
    primary: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
    },
    secondary: {
      default: {},
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
    },
    director: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
    },
  },
  dashboard: {
    type: String,
    required: [true, 'sites need a dashboard id'],
  },
  allotments: {
    total: Number,
    freeChoice: Number,
    manualPlacement: Number,
  },
  ahmAssigned: {
    eid: String,
    name: String,
    email: String,
  },
  season: {
    type: String,
    validate: {
      validator: validateSeason,
      message:
        'invalid season format. try YYYY Summer or YYYY-YYYY School Year',
    },
  },
});

const Site = mongoose.model('Site', siteSchema);

export default Site;
