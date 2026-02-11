# frozen_string_literal: true

require_relative '../../config/environment'
require 'solid_queue/cli'

namespace :primero_kiosk do
  desc 'Export translations to JS file(s)'
  task :i18n_js do
    Dir.glob(Rails.root.join('app', 'frontend', 'translations.*')).each { |file| File.delete(file) }

    `i18n export -r lib/i18n_loader.rb`
  end

  desc 'Re-run failed PrimeroSyncJob'
  task :rerun_failed_sync_jobs do
    puts 'Rerunning failed jobs...'
    # Only retries jobs with a FailedExecution
    SolidQueue::Job.joins(:failed_execution).where(class_name: 'PrimeroSyncJob', finished_at: nil).each(&:retry)
    puts 'Done!'
  end
end
