import fetch from 'node-fetch';
import chalk from 'chalk';
import url from 'url';

export default class JiraApi {
  constructor(options) {
    this.protocol = options.protocol;
    this.host = options.host;
    this.apiPath = options.apiPath;
    this.workLogApiPath = options.workLogApiPath;
    this.reportApiPath = options.reportApiPath;
    this.authOptions = {
      user: options.username,
      pass: options.password,
    };
  }

  getURI(options = {}) {
    let path;
    if (options.mod === 'worklog') {
      path = this.workLogApiPath;
    } else if (options.mod === 'issue' || options.mod === 'user') {
      path = this.apiPath + options.mod;
    } else if (options.mod === 'report') {
      path = this.reportApiPath;
    }
    return url.format({
      protocol: this.protocol,
      hostname: this.host,
      pathname: `${path}${options.target ? `/${options.target}` : ''}`,
      query: options.query ? options.query : '',
    });
  }

  getAuthData() {
    return `Basic ${Buffer.from(`${this.authOptions.user}:${this.authOptions.pass}`).toString('base64')}`;
  }

  getRequestHeader() {
    return {
      Authorization: this.getAuthData(),
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    };
  }

  async getIssueInfo(code) {
    const uriOptions = {
      mod: 'issue',
      target: code,
    };
    const fetchOptions = {
      method: 'GET',
      headers: this.getRequestHeader(),
    };
    return fetch(this.getURI(uriOptions), fetchOptions)
      .then(res => res.json())
      .catch(err => console.log(chalk.red(err)));
  }

  async getUserInfo() {
    const uriOptions = {
      mod: 'user',
      query: {
        username: this.authOptions.user,
      },
    };
    const fetchOptions = {
      method: 'GET',
      headers: this.getRequestHeader(),
    };
    return fetch(this.getURI(uriOptions), fetchOptions)
      .then(res => res.json())
      .catch(err => console.log(chalk.red(err)));
  }

  async postWorkLog(options) {
    const issue = await this.getIssueInfo(options.task);
    const user = await this.getUserInfo();
    const today = JiraApi.parseDate(options.date);
    const uriOptions = {
      mod: 'worklog',
    };
    const fetchOptions = {
      method: 'POST',
      headers: this.getRequestHeader(),
      body: JSON.stringify({
        attributes: {
          _Видработ_: {
            name: 'Вид работ',
            value: options.action,
            workAttributeId: 2,
          },
        },
        comment: options.comment,
        originTaskId: issue.id,
        started: today,
        timeSpentSeconds: options.time * 3600,
        worker: user.key,
      }),
    };
    return fetch(this.getURI(uriOptions), fetchOptions)
      .then(res => res.status)
      .catch(err => console.log(chalk.red(err)));
  }

  async getLogTimeReport(endDate) {
    const dateE = JiraApi.parseDate(endDate);
    const arrDateB = dateE.split('-');
    arrDateB[2] = '01';
    const dateB = arrDateB.join('-');
    const uriOptions = {
      mod: 'report',
      query: {
        username: this.authOptions.user,
        dateFrom: dateB,
        dateTo: dateE,
      },
    };
    const fetchOptions = {
      method: 'GET',
      headers: this.getRequestHeader(),
    };
    return fetch(this.getURI(uriOptions), fetchOptions)
      .then(res => res.json())
      .catch(err => console.log(chalk.red(err)));
  }

  static parseDate(someDate) {
    return !someDate ? new Date().toISOString().split('T')[0] : someDate.split('.').reverse().join('-');
  }
}
