import mongoose from 'mongoose';
import AHM from '../models/AHM';
import { NextFunction, Request, Response } from 'express';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newUser = new AHM({
      firstName: req.body.newUser.given_name,
      lastName: req.body.newUser.family_name,
      ...req.body.newUser,
    });

    await newUser.save();
    res
      .cookie('jwt', req.body.newUser.JWT, {
        path: '/',
        httpOnly: true,
        secure: true, // Set to true if served over HTTPS
        maxAge: 15600000000, // 6 months
        sameSite: 'strict',
      })
      .status(200)
      .json(req.body.newUser.JWT);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await AHM.findOne({ JWT: req.cookies.jwt });
    if (!user) res.status(500).json({ message: 'Please Sign Up first' });
    //console.log(req.cookies.jwt);
    if (!req.cookies.jwt)
      res.cookie('jwt', req.body.jwt, {
        path: '/',
        httpOnly: true,
        secure: true, // Set to true if served over HTTPS
        maxAge: 15600000000, // 6 months
        sameSite: 'strict',
      });

    res.status(200).json({ jwt: req.cookies.jwt });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};
