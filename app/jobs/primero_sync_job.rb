# frozen_string_literal: true

# A job that creates cases in Primero
class PrimeroSyncJob < ApplicationJob
  queue_as :records
  queue_with_priority 0

  def perform(record)
    primero_sync_service = PrimeroSyncService.instance
    primero_sync_service.create(record)
  end
end
