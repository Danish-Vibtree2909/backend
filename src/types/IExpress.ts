import { Request, Response } from 'express'
import IAuth from './auth'
import JWTAuthInterface from './jwtAuthTypes';

export interface IRequest extends Request{
    User?: IAuth,
    JWTUser?: JWTAuthInterface
}

export interface IResponse extends Response{

}
