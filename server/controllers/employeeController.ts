import { NextFunction, Request, Response } from 'express';
import Employee from '../models/Employee';
import { pick, isEqual } from 'lodash';

export const populateEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const fields = [
    'eid',
    'name',
    'firstName',
    'locationCode',
    'siteName',
    'season',
    'email',
  ];
  for (const row of req.body.employees) {
    const updateEmployee = {
      eid: row[0],
      name: row[7],
      firstName: row[8],
      locationCode: row[9],
      siteName: row[10],
      season: process.env.SEASON,
      email: row[16],
    };
    try {
      const findEmployee = await Employee.findOne({
        eid: updateEmployee.eid,
        season: updateEmployee.season,
      });
      //console.log(findEmployee);
      if (!findEmployee) {
        new Employee(updateEmployee).save().catch((e) => {
          console.log(e.message);
        });
        //console.log(`Created employee ${eid} ${name}`);
        continue;
      }
      //console.log(findEmployee);
      //console.log(pick(updateEmployee, fields));
      if (!isEqual(pick(findEmployee, fields), updateEmployee)) {
        //console.log(`Same employee ${eid} ${updateEmployee.name}`);
        /*console.log(
          `Updating employee ${findEmployee.eid} ${findEmployee.email}`,
        );*/
        Employee.updateOne(
          { eid: findEmployee.eid, season: findEmployee.season },
          { ...updateEmployee },
        )
          .exec()
          .catch((e) => {
            console.log(e.message);
          });
        /*console.log(
          `Updated employee ${updateEmployee.eid} ${updateEmployee.email}`,
        );*/
      }

      //console.log(`Created employee ${eid} ${name}`);
      next();
    } catch (e) {
      console.log(
        `Error creating employee ${updateEmployee.eid} ${updateEmployee.name} ${e.message}`,
      );
    }
  }
};

export const assignAHMtoEmployee = async (req: Request, res: Response) => {
  const tabs = req.body.ahmDict;
  const processedAHM = tabs.map((tab: any) => tab.range.split('!')[0]);
  if (!isEqual(processedAHM, req.body.AHMs)) return;
  //if the ahm and the processed ahm are not the same, return, otherwise continue
  for (const row of tabs) {
    try {
      const AHMName = row.range.split('!')[0];
      const dataArray = row.values[0];
      const findAHM = await Employee.findOne({
        $or: [{ firstName: AHMName }, { preferredName: AHMName }],
        season: process.env.SEASON,
        email: {
          $regex: /(@boston.gov)/,
          $options: 'i', // case insensitive}
        },
      });
      if (!findAHM) {
        console.log(`AHM ${AHMName} not found`);
        continue;
      }
      for (const employee of dataArray) {
        if (!employee) continue;
        const findEmployee = await Employee.findOne({
          eid: employee,
          season: process.env.SEASON,
        });
        if (!findEmployee) {
          console.log(`Employee ${employee} not found`);
          continue;
        }

        findEmployee.ahmAssigned = findAHM._id;
        findEmployee.save().catch((e) => {
          console.log(e.message);
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  }
};
