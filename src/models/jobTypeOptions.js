module.exports = (sequelize, Sequelize) => {
  const job_type_options = sequelize.define(
    'job_type_options',
    {
      value:{type: Sequelize.STRING(30), primaryKey: true,  field: 'value' },

    },
    {
      tableName: 'job_type_options'
    }
  );

  return job_type_options;
}
