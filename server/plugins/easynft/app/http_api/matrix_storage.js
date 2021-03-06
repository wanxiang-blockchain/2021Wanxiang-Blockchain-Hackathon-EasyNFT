/**
 * @fileOverview maxtrix storage api
 * @name matrix_storage.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { Service: API } = require('egg');

class MatrixStorageAPI extends API {

  async bucket_files_list(condition) {

    const { ctx, app, config } = this;
    const headers = ctx.helper.generateMatrixStorageAPIHeaders();

    const res = await app.curl(`${config.easynft.maxtrix_storage.host}${config.easynft.maxtrix_storage.basePath}/bucket_files_list`, {
      dataType: 'json',
      method: 'POST',
      headers,
      data: condition,
    });
    ctx.helper.throwHttpError(res);

    const resp = res.data;
    ctx.helper.throwMatrixStorageAPIError(resp);
    const { objs: items, ...others } = resp.data;
    return { items, ...others };
  }

  async file_detail(condition) {

    const { ctx, app, config } = this;

    const headers = ctx.helper.generateMatrixStorageAPIHeaders();

    const res = await app.curl(`${config.easynft.maxtrix_storage.host}${config.easynft.maxtrix_storage.basePath}/file_detail`, {
      dataType: 'json',
      method: 'POST',
      headers,
      data: condition,
    });
    ctx.helper.throwHttpError(res);

    const resp = res.data;
    let resp_data;
    try {
      ctx.helper.throwMatrixStorageAPIError(resp);
      resp_data = resp.data;
    } catch (e) {
      if (e.biz_code !== 15062) {
        throw e;
      }
    }

    return resp_data ? resp_data.objs || [ resp_data ] : [];
  }

  async ask_for_upload_credential(params) {

    const { ctx, app, config } = this;
    const headers = ctx.helper.generateMatrixStorageAPIHeaders();

    const res = await app.curl(`${config.easynft.maxtrix_storage.host}${config.easynft.maxtrix_storage.basePath}/ask_for_upload_credential`, {
      dataType: 'json',
      method: 'POST',
      headers,
      data: params,
    });
    ctx.helper.throwHttpError(res);

    const resp = res.data;
    ctx.helper.throwMatrixStorageAPIError(resp);

    return resp.data;

  }

  async upload_file(content, params) {

    const { ctx, app, config } = this;
    const headers = ctx.helper.generateMatrixStorageAPIHeaders({
      'Content-Type': undefined,
      EventId: params.event_id,
      BucketName: params.bucket_name,
      IsVerified: params.is_verified,
      IsPrivate: params.is_private,
      FileName: params.file_name,
      FileSize: params.file_size,
      Credential: params.credential,
    });

    const res = await app.curl(`${params.store_host}${config.easynft.maxtrix_storage.storeBasePath}/upload_file`, {
      method: 'POST',
      headers,
      dataType: 'json',
      files: [ content ],
      timeout: 60000,
    });
    ctx.helper.throwHttpError(res);

    const resp = res.data;
    ctx.helper.throwMatrixStorageAPIError(resp);
    return resp.data;

  }

  async extract_file(params) {

    const { ctx, app, config } = this;
    const headers = ctx.helper.generateMatrixStorageAPIHeaders();

    const res = await app.curl(`${config.easynft.maxtrix_storage.host}${config.easynft.maxtrix_storage.basePath}/extract_file`, {
      dataType: 'json',
      method: 'POST',
      headers,
      data: params,
    });
    ctx.helper.throwHttpError(res);

    const resp = res.data;
    ctx.helper.throwMatrixStorageAPIError(resp);

    return resp.data;
  }

  async download_file(params) {

    const { ctx, app, config } = this;
    const headers = ctx.helper.generateMatrixStorageAPIHeaders();
    const searchParams = new URLSearchParams({
      bucket_name: params.bucket_name,
      cid: params.cid,
    });

    const res = await app.curl(`${params.store_host}${config.easynft.maxtrix_storage.storeBasePath}/download_file?${searchParams.toString()}`, {
      method: 'GET',
      headers,
      timeout: 60000,
    });
    ctx.helper.throwHttpError(res);

    return res.data;

  }

}

module.exports = MatrixStorageAPI;
