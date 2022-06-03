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
    {
      id: null,
      text: 'Текущий',
    },
    {
      id: '181',
      text: 'Разработка',
    },
    {
      id: '191',
      text: 'На ревью',
    },
    {
      id: '211',
      text: 'К разработке',
    },
    {
      id: '411',
      text: 'К тестированию',
    },
    {
      id: '471',
      text: 'Вернуть на анализ',
    },
    {
      id: '561',
      text: 'В ожидание',
    },
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
