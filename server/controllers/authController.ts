import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import {
  Credentials,
  OAuth2Client,
  UserRefreshClient,
} from 'google-auth-library';
import mongoose from 'mongoose';
import { jwtDecode } from 'jwt-decode';

/* global google */
//declare const google: any;
dotenv.config({ path: './config.env' });

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'postmessage',
);

oAuth2Client.on('tokens', async (tokens: Credentials) => {
  if (tokens.refresh_token) {
    // store the refresh_token in my database!
    //console.log('Refresh token detected: ' + tokens.refresh_token);
  }
  //console.log('Access token detected: ' + tokens.access_token);
});

export const signUpGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //console.log(req);
  //console.log(req.body.code);
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  oAuth2Client.credentials = tokens;
  //console.log(oAuth2Client.credentials);
  //console.log(tokens);

  req.body.newUser = {
    ...jwtDecode(oAuth2Client.credentials.id_token),
    access_token: oAuth2Client.credentials.access_token,
    refresh_token: oAuth2Client.credentials.refresh_token,
    JWT: oAuth2Client.credentials.id_token,
  };
  next();
  //res.status(200).json(tokens);
};

export const refreshToken = async (req: Request, res: Response) => {
  const user = new UserRefreshClient(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    req.body.refreshToken,
  );
  const { credentials } = await user.refreshAccessToken(); // obtain new tokens
  res.status(200).json(credentials);
};

const getUserData = async (access_token: string) => {
  const response = await fetch(
    `https://google.apis.com/oauth2/v3/userinfo?access_token${access_token}`,
  );
  return response.json();
};

export const checkJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const code = String(req.query.code);

  /*try {
    const redirectUrl = 'http://127.0.0.1:3000/oauth';
    const oAuth2Client: OAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl,
    );
    const response: GetTokenResponse = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(response.tokens);
    //const user: Credentials = oAuth2Client.credentials;
    //await getUserData(user.access_token);
    res.status(111).json(oAuth2Client);
  } catch (e) {
    console.log(e);
  }*/
};
