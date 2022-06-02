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
};

export default config;
