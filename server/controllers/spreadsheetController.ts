import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import {
  Credentials,
  OAuth2Client,
  UserRefreshClient,
} from 'google-auth-library';
import mongoose from 'mongoose';
import { jwtDecode } from 'jwt-decode';
import { google } from 'googleapis';
import AHM from '../models/AHM';

dotenv.config({ path: './config.env' });

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'postmessage',
);

let service: any;
let AHMs = [];

export const grabAdminCentralRoster = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.cookies.jwt;
    const findUser = await AHM.findOne({
      jwt: user,
    });
    if (!findUser) {
      res.status(500).json({ message: 'Not Logged In' });
      return;
    }

    oAuth2Client.setCredentials({
      refresh_token: findUser.refresh_token,
    });

    service = google.sheets({
      version: 'v4',
      auth: oAuth2Client,
    });

    const results = await service.spreadsheets.values.get({
      spreadsheetId: '1u92wBV7lZ6gFIhyb75MLdrqn04mO7dc4S1DSAsndxGU',
      range: 'Central Roster!A3:Q',
      majorDimension: 'ROWS',
      valueRenderOption: 'FORMATTED_VALUE',
    });

    req.body.employees = results.data.values;

    let ahms = await service.spreadsheets.get({
      spreadsheetId: '1rTcgLWpuaNt8tu-uOoIdRDb_dd3wdnXksTVl0q6FL9A',
      includeGridData: true,
      fields: 'sheets.properties(title)',
    });

    ahms = ahms.data.sheets.map((sheet: any) => sheet.properties.title);
    AHMs = ahms.filter((ahm: string) => !/(template)|(params)/gi.test(ahm));

    const ahmAssignment = await service.spreadsheets.values.batchGet({
      spreadsheetId: '1rTcgLWpuaNt8tu-uOoIdRDb_dd3wdnXksTVl0q6FL9A',
      ranges: AHMs.map((ahm) => `${ahm}!C4:C`),
      majorDimension: 'COLUMNS',
      valueRenderOption: 'FORMATTED_VALUE',
    });

    //console.log(AHMs);
    req.body.ahmDict = ahmAssignment.data.valueRanges;
    req.body.AHMs = AHMs;

    //console.log(results);
    res.status(200).json({ admin: results, ahm: ahmAssignment, AHMs });
    next();
    /*process.nextTick(async () => {
      await updateEmployees(req, res);
    });*/
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const grabCBOList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.cookies.jwt;
    const findUser = await AHM.findOne({
      jwt: user,
    });
    if (!findUser) res.status(500).json({ message: 'Not Logged In' });

    oAuth2Client.setCredentials({
      refresh_token: findUser.refresh_token,
    });

    service = google.sheets({
      version: 'v4',
      auth: oAuth2Client,
    });

    const results = await service.spreadsheets.values.get({
      spreadsheetId: '1u92wBV7lZ6gFIhyb75MLdrqn04mO7dc4S1DSAsndxGU',
      range: 'CBOsList!A2:E',
      majorDimension: 'ROWS',
      valueRenderOption: 'FORMATTED_VALUE',
    });

    req.body.cbos = results.data.values;

    //console.log(results);
    res.status(200).json({ ...results });
    next();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const grabEnteredTime = async (req: Request, res: Response) => {
  try {
    const user = req.cookies.jwt;
    const findUser = await AHM.findOne({
      jwt: user,
    });
    if (!findUser) res.status(500).json({ message: 'Not Logged In' });

    oAuth2Client.setCredentials({
      refresh_token: findUser.refresh_token,
    });

    service = google.sheets({
      version: 'v4',
      auth: oAuth2Client,
    });

    const results = await service.spreadsheets.values.get({
      spreadsheetId: '1u92wBV7lZ6gFIhyb75MLdrqn04mO7dc4S1DSAsndxGU',
      range: 'AdminModule!A2:J',
      majorDimension: 'ROWS',
      valueRenderOption: 'FORMATTED_VALUE',
    });

    //console.log(results);
    res.status(200).json({ admin: results });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
