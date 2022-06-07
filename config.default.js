const config = {
  jiraOpts: {
    protocol: 'https',
    host: 'jira-medmis.bars.group',
    apiPath: 'rest/api/latest/',
    workLogApiPath: 'rest/tempo-timesheets/4/worklogs',
    reportApiPath: 'rest/tempo-timesheets/3/worklogs',
    username: '',
    password: '',
  },
  workKind: [
    'Разработка',
    'Собрания',
    'Код ревью',
    'Перенос',
    'Консультация',
    'Доработка',
  ],
  projects: [
    'MEDDEV',
    'MEDIMP',
    'MEDPM',
  ],

  taskStatuses: [
    'Текущий',
    'Взять в разработку',
    'На ревью',
    'К разработке',
    'К тестированию',
    'Вернуть на анализ',
    'В ожидание',
  ],

  taskPerformers: [
    {
      login: null,
      name: 'Текущий',
    },
    {
      login: '',
      name: '',
    },
  ],
};

export default config;
