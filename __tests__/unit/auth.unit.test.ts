import {jwtService} from "../../src/routes/auth-routes/application/jwt-service";
import {Request, Response, NextFunction} from "express";
import {accessTokenGuard} from "../../src/routes/auth-routes/middleware-auth/accessTokenGuard";

// переписать тест
describe('UNIT', () => {
    const checkAccessTokenUseCase = jwtService.getPayloadFromToken;

    it('should not verify noBearer auth', async () => {
        const req = {
            headers: {
                authorization: 'Basic abc123'
            }
        } as Partial<Request>;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as Partial<Response>;

        const next = jest.fn();

        await accessTokenGuard(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Not authorized');
        expect(next).not.toHaveBeenCalled();
    });

    it('should not verify in jwtService', async () => {
        const req = {
            headers: {
                authorization: 'Bearer valid.token.here'
            }
        } as Partial<Request>;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as Partial<Response>;

        const next = jest.fn();

        jest.spyOn(jwtService, 'getPayloadFromToken').mockResolvedValue(null);

        await accessTokenGuard(req as Request, res as Response, next as NextFunction);

        expect(jwtService.getPayloadFromToken).toHaveBeenCalledWith('valid.token.here');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Not authorized');
        expect(next).not.toHaveBeenCalled();
    });

    it('should verify access token', async () => {
        const req = {
            headers: {
                authorization: 'Bearer valid.token.here'
            }
        } as Partial<Request>;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as Partial<Response>;

        const next = jest.fn();

        // Мокаем возврат userId
        jest.spyOn(jwtService, 'getPayloadFromToken').mockResolvedValue('user123');

        await accessTokenGuard(req as Request, res as Response, next as NextFunction);

        expect(jwtService.getPayloadFromToken).toHaveBeenCalledWith('valid.token.here');
        //expect(req.userId).toBe('user123');
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });


});
