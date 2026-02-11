# frozen_string_literal: true

# A service for syncing cases with Primero.
class PrimeroSyncService
  def self.instance
    @instance ||= new
  end

  def initialize
    @connector = ApiConnector::PrimeroConnector.build_from_env
  end

  def create(record)
    @connector.create(record)
  end
end
