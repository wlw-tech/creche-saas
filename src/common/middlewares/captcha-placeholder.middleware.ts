import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware placeholder pour la vérification hCaptcha
 * Pour l'instant, accepte toutes les requêtes mais log un warning si le token est absent
 * À l'avenir, vérifier le token auprès de hCaptcha API
 */
@Injectable()
export class CaptchaPlaceholderMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CaptchaPlaceholderMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const captchaToken = req.headers['x-captcha-token'];

    if (!captchaToken) {
      this.logger.warn(
        `[CAPTCHA] Token absent pour ${req.method} ${req.path} depuis IP ${req.ip}. Captcha non appliqué (placeholder).`,
      );
    } else {
      this.logger.debug(
        `[CAPTCHA] Token reçu pour ${req.method} ${req.path}. Vérification placeholder (TODO: vérifier auprès de hCaptcha).`,
      );
      // TODO: Vérifier le token auprès de hCaptcha API
      // const isValid = await this.verifyCaptchaToken(captchaToken);
      // if (!isValid) {
      //   throw new BadRequestException('Captcha verification failed');
      // }
    }

    next();
  }
}

