#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import config from '../config.js';
import JiraApi from './jira/JiraApi.js';
import bashRouter from './bashRouter/bashRouter.js';
import { empty } from './utils/utils.js';

const program = new Command();

const jira = new JiraApi(config.jiraOpts);

program
  .version('1.0.0')
  .description('Time logging functionality in bash for Jira');

program
  .command('log')
  .option('-a', 'autoLogTime')
  .option('-m', 'manualLogTime')
  .action(name => logTime(name));

program
  .command('rep')
  .action(() => getReport(false).then(rep => {
    console.table(rep);
  }));

program
  .command('up')
  .action(updateTask);

program.parse(process.argv);

function logTime(name) {
  if (!name.m) {
    bashRouter.autoLogTime().then(async result => {
      const options = {
        type: 'auto',
        task: `MEDDEV-${result.task}`,
        date: false,
        time: result.time,
        action: result.action,
        comment: result.comment,
      };
      const data = await jira.postWorkLog(options);
      if (+data !== 200) {
        console.log(chalk.red('Ошибка при обработке запроса: ', data));
      } else if (result.upd_task === 'Да') {
        logTimeSuccess(options.date, options.task);
      } else {
        logTimeSuccess();
      }
    });
  } else {
    bashRouter.manualLogTime().then(async result => {
      const options = {
        type: 'manual',
        task: `${result.project}-${result.task}`,
        date: result.date,
        time: result.time,
        action: result.action,
        comment: result.comment,
      };
      const data = await jira.postWorkLog(options);
      if (+data !== 200) {
        console.log(chalk.red('Ошибка при обработке запроса: ', data));
      } else if (result.upd_task === 'Да') {
        logTimeSuccess(options.date, options.task);
      } else {
        logTimeSuccess(options.date);
      }
    });
  }
}

function logTimeSuccess(endDate, task = false) {
  console.log(chalk.green('Данные успешно добавлены!'));
  getReport(endDate).then(rep => {
    console.table(rep);
    if (task) {
      console.log(chalk.green.underline('Обновляем задачу:'));
      updateTask(task);
    }
  });
}

function updateTask(task) {
  bashRouter.updateTask(task).then(async result => {
    const options = {
      task: !empty(task) ? task : `${result.project}-${result.task}`,
      comment: result.comment,
      status: result.status,
      performer: result.performer,
    };
    if (!empty(options.comment)) {
      const postCommentResult = await jira.postTaskComment(options);
      if (+postCommentResult !== 201) {
        console.log(chalk.red('Ошибка при добавлении комментария: ', postCommentResult));
      } else {
        console.log(chalk.green('К задаче добавлен комментарий!'));
      }
    }
    if (!empty(options.status) && options.status !== 'Текущий') {
      const postCommentResult = await jira.postTaskStatus(options);
      if (+postCommentResult !== 204) {
        console.log(chalk.red('Ошибка при изменении статуса: ', postCommentResult));
      } else {
        console.log(chalk.green('Статус задачи изменен!'));
      }
    }
    if (!empty(options.performer && options.performer !== 'Текущий')) {
      const postCommentResult = await jira.putTaskPerformer(options);
      if (+postCommentResult !== 204) {
        console.log(chalk.red('Ошибка при изменении исполнителя: ', postCommentResult));
      } else {
        console.log(chalk.green('Исполнитель задачи изменен!'));
      }
    }
  });
}

async function getReport(endDate) {
  let sum = 0;
  const result = [];
  const data = await jira.getLogTimeReport(endDate);
  data.forEach(log => {
    const date = log.dateStarted.split('T')[0].split('-').reverse().join('.');
    const inx = result.findIndex(item => item.date === date);
    if (inx !== -1) {
      result[inx].logTime += (+log.timeSpentSeconds / 3600);
    } else {
      result.push({ date, logTime: +log.timeSpentSeconds / 3600 });
    }
    sum += (+log.timeSpentSeconds / 3600);
  });
  result.push({ date: '----------', logTime: sum });
  return result;
}
