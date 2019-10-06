// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportFormat = require('../../../app/middleware/format');

declare module 'egg' {
  interface IMiddleware {
    format: typeof ExportFormat;
  }
}
