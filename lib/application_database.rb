# frozen_string_literal: true

require 'yaml'
require 'erb'
require 'active_support/core_ext/hash/indifferent_access'
require 'pg'
require 'singleton'
require 'date'

# Raw PG connection to the Primero kiosk database.
# Call this class only in scripts
class ApplicationDatabase
  include Singleton

  MIGRATION_DATE_FORMAT = '%Y%m%d%H%M%S'

  attr_accessor :connection

  def initialize
    self.connection = PG.connect(connection_string(load_settings("#{File.dirname(__FILE__)}/../config/database.yml")))
  end

  def connection_string(settings)
    rails_env = (ENV['RAILS_ENV'] || 'development').to_s
    env_config = settings[rails_env]

    "host=#{env_config['host']} " \
      "dbname=#{env_config['database']} " \
      "user=#{env_config['username']} " \
      "password=#{env_config['password']} " \
      "sslmode=#{env_config['sslmode'] || 'prefer'}"
  end

  def load_settings(file_path)
    return {} unless File.exist?(file_path)

    YAML.safe_load(ERB.new(File.read(file_path)).result, aliases: true).with_indifferent_access || {}
  end

  def seeded?
    response = connection.exec('SELECT count(1) as count FROM system_settings')
    response[0]['count'].to_i.positive?
  end

  def migrated?
    # TODO: This might need to change if primero moves to a different schema.
    missed_table = connection.exec(
      "SELECT 1 FROM information_schema.tables WHERE table_name = 'schema_migrations'"
    ).values.empty?
    return false if missed_table

    response = connection.exec('SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1')
    response[0]['version'] == last_migration_date
  end

  def last_migration_date
    migration_files = Dir.glob("#{File.dirname(__FILE__)}/../db/migrate/**.rb")
    migration_dates = migration_files.map { |path| path.scan(/[0-9]{14}/) }.flatten
    max_date = migration_dates.map { |migration_date| DateTime.strptime(migration_date, MIGRATION_DATE_FORMAT) }.max
    max_date.strftime(MIGRATION_DATE_FORMAT)
  end

  def configuration_file_version
    response = connection.exec('SELECT configuration_file_version FROM system_settings limit 1')
    return if response.values.empty?

    response[0]['configuration_file_version']
  end
end
