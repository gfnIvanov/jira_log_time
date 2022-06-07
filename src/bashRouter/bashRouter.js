import inquirer from 'inquirer';
import config from '../../config.js';
import { empty } from '../utils/utils.js';

const bashRouter = {
  logQuestions: [
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
    {
      type: 'list',
      name: 'upd_task',
      message: 'Обновить задачу после логирования?',
      choices: ['Нет', 'Да'],
    },
  ],

  autoLogTime() {
    const questions = {
      type: 'input',
      name: 'task',
      message: 'Номер таска MEDDEV: ',
    };
    this.logQuestions.unshift(questions);
    return inquirer.prompt(this.logQuestions);
  },

  manualLogTime() {
    const questions = [
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
    ];
    this.logQuestions.unshift(...questions);
    return inquirer.prompt(this.logQuestions);
  },

  updateTask(chank) {
    const updQuestions = [
      {
        type: 'list',
        name: 'project',
        message: 'Проект:',
        choices: config.projects,
      },
      {
        type: 'input',
        name: 'task',
        message: 'Номер таска: ',
      },
      {
        type: 'input',
        name: 'comment',
        message: 'Комментарий: ',
      },
      {
        type: 'list',
        name: 'status',
        message: 'Статус:',
        choices: config.taskStatuses,
      },
      {
        type: 'list',
        name: 'performer',
        message: 'Исполнитель:',
        choices: config.taskPerformers.map(user => user.name),
      },
    ];
    if (!empty(chank)) {
      updQuestions.splice(0, 2);
    }
    return inquirer.prompt(updQuestions);
  },
};

export default bashRouter;
