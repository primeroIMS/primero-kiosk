# frozen_string_literal: true

namespace :primero_kiosk do
  desc 'Export translations to JS file(s)'
  task :i18n_js do
    Dir.glob(Rails.root.join('app', 'frontend', 'translations.*')).each { |file| File.delete(file) }

    `i18n export -r lib/i18n_loader.rb`
  end

  desc 'Re-run failed PrimeroSyncJob'
  task :primero_sync_jobs, %i[rerun] => :environment do |_, args|
    rerun = args[:rerun] == 'true'
    running_job_ids = SolidQueue::ClaimedExecution.pluck(:job_id)

    puts "#{running_job_ids.size} currently running."

    failed_jobs = SolidQueue::Job.joins(:failed_execution).where(
      class_name: 'PrimeroSyncJob', finished_at: nil
    ).where.not(id: running_job_ids)

    puts "#{failed_jobs.size} have failed and are not running."

    retryable_exception_names = ApiConnector::PrimeroConnector::RETRY_EXCEPTIONS.map do |exception|
      exception.is_a?(String) ? exception : exception.name
    end

    retryable_statuses = "server responded with status #{ApiConnector::PrimeroConnector::RETRY_STATUSES.join('|')}"

    # Only retries jobs with a FailedExecution and when the exception_class or status is retryable
    retryable_jobs = failed_jobs.where(
      'error ~ ? OR error ~ ?', retryable_exception_names.join('|'), retryable_statuses
    )

    if rerun
      puts 'Rerunning failed jobs...'
      puts "#{retryable_jobs.size} will be retried..."
      retryable_jobs.each(&:retry)
    else
      puts "#{retryable_jobs.size} are retryable."
    end
  end

  # Exports Screen and Lookup translations to a YAML file.
  # USAGE: rails kiosk:export_i18n[locale]
  # Args:
  #   locale - (ex. 'en', 'es', 'fr', 'ar') DEFAULT: 'en'
  desc 'Export screens and lookups to a yaml file for translation'
  task :export_config_translations_i18n, %i[locale] => :environment do |_, args|
    puts 'Exporting Screen and Lookup i18n configurations to YAML...'

    locale = args[:locale].presence || 'en'

    exporter = ConfigTranslationExporter.new(locale: locale)
    exporter.export

    puts "Done! Exported to #{exporter.export_directory}/"
  end
end
