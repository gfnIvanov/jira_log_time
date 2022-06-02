#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import config from '../config.js';
import JiraApi from './jira/JiraApi.js';

const program = new Command();

const jira = new JiraApi(config.jiraOpts);

program
  .version('1.0.0')
  .description('Time logging functionality in bash for Jira');

program
  .command('log')
  .option('-a', 'autoCreate')
  .option('-m', 'manualCreate')
  .action(name => logTime(name));

program
  .command('rep')
  .action(() => getReport(false).then(rep => {
    console.table(rep);
  }));

program.parse(process.argv);

function logTime(name) {
  if (!name.m) {
    inquirer.prompt(
      [
        {
          type: 'input',
          name: 'task',
          message: 'Номер таска MEDDEV: ',
        },
        {
          type: 'input',
          name: 'time',
          message: 'Затраченное время (ч): ',
        },
        {
          type: 'list',
          name: 'action',
          message: 'Вид деятельности',
          choices: config.workKind,
        },
        {
          type: 'input',
          name: 'comment',
          message: 'Комментарий: ',
        },
      ],
    ).then(async result => {
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
      } else {
        console.log(chalk.green('Данные успешно добавлены!'));
        getReport().then(rep => console.table(rep));
      }
    });
  } else {
    inquirer.prompt(
      [
        {
          type: 'list',
          name: 'project',
          message: 'Проект',
          choices: config.projects,
        },
        {
          type: 'input',
          name: 'task',
          message: 'Номер таска: ',
        },
        {
          type: 'input',
          name: 'date',
          message: 'Дата в формате dd.mm.yyyy: ',
        },
        {
          type: 'input',
          name: 'time',
          message: 'Затраченное время (ч): ',
        },
        {
          type: 'list',
          name: 'action',
          message: 'Вид деятельности',
          choices: config.workKind,
        },
        {
          type: 'input',
          name: 'comment',
          message: 'Комментарий: ',
        },
      ],
    ).then(async result => {
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
      } else {
        console.log(chalk.green('Данные успешно добавлены!'));
        getReport(result.date).then(rep => console.table(rep));
      }
    });
  }
}

async function getReport(endDate) {
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
  });
  return result;
}
