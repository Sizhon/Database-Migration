import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import Site from '../models/Site';
import { pick, isEqual } from 'lodash';
import Employee from '../models/Employee';

export const populateCBOs = async (req: Request, res: Response) => {
  for (const row of req.body.cbos) {
    const updateCBO = {
      locationCode: row[0],
      name: row[1],
      dashboard: row[4],
      season: process.env.SEASON,
    };

    try {
      const findCBO = await Site.findOne({
        locationCode: updateCBO.locationCode,
        season: updateCBO.season,
      });
      if (!findCBO) {
        new Site(updateCBO).save().catch((e) => {
          console.log(e.message);
        });
        continue;
      }
      if (!isEqual(pick(findCBO, Site), updateCBO)) {
        Site.updateOne(
          { locationCode: findCBO.locationCode, season: findCBO.season },
          { ...updateCBO },
        )
          .exec()
          .catch((e) => {
            console.log(e.message);
          });
      }
    } catch (e) {
      console.log(e.message);
    }
  }
};
