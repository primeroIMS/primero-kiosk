#! /usr/bin/env ruby

require_relative('../lib/application_database')

def check_migrated
  if ApplicationDatabase.instance.migrated?
    puts 'DATABASE_MIGRATED'
  else
    puts 'DATABASE_MIGRATION_PENDING'
  end

  ApplicationDatabase.instance.connection.close
end

check_migrated
