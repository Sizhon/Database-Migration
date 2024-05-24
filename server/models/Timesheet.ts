import mongoose from 'mongoose';
import { validateTime } from '../utils/validators';

const timesheetSchema = new mongoose.Schema({
  eid: {
    type: Number,
    require: [true, 'timesheet must belong to someone'],
  },
  site: {
    type: String,
    require: [true, 'timesheet must be for a site'],
  },
  season: {
    type: String,
  },
  timeEntered: {
    type: [
      {
        week: Number,
        startDate: Date,
        endDate: Date,
        hours: {
          mon: {
            start: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
            end: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
          },
          tue: {
            start: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
            end: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
          },
          wed: {
            start: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
            end: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
          },
          thu: {
            start: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
            end: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
          },
          fri: {
            start: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
            end: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
          },
          sat: {
            start: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
            end: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
          },
          sun: {
            start: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
            end: {
              type: String,
              default: '12:00 AM',
              validate: validateTime,
            },
          },
        },
      },
    ],
  },
});
