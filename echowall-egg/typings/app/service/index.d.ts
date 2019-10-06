// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportQuery = require('../../../app/service/query');

declare module 'egg' {
  interface IService {
    query: ExportQuery;
  }
}
