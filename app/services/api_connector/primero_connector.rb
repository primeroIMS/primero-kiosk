# frozen_string_literal: true

# Connector for syncing cases with Primero.
# For now connection parameters for these endpoints is configured through environment variables.
class ApiConnector::PrimeroConnector < ApiConnector::AbstractConnector
  PRIMERO_RECORD_API_PATH = {
    'case' => '/api/v2/cases',
    'incident' => '/api/v2/incidents',
    'registry' => '/api/v2/registry_records'
  }.freeze
  SUCCESSFUL_STATUSES = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226].freeze
  RETRY_INTERVAL = 60
  RETRY_MAX = 3
  RETRY_BACKOFF_FACTOR = 2
  RETRY_STATUSES = [404, 429, 502, 503].freeze
  RETRY_EXCEPTIONS = (
    Faraday::Retry::Middleware::DEFAULT_EXCEPTIONS + [Faraday::ConnectionFailed]
  ).freeze
  RETRY_METHODS = %i[post].freeze
  ENV_PREFIX = 'PRIMERO_API_'

  def self.build_from_env
    super(prefix: ENV_PREFIX)
  end

  def initialize(options = {})
    config_retry_options(options)
    super(options)
  end

  def config_retry_options(options = {})
    options[:retry_max] = options[:retry_max]&.to_i || RETRY_MAX
    options[:retry_interval] = options[:retry_interval]&.to_i || RETRY_INTERVAL
    options[:retry_backoff_factor] = options[:retry_backoff_factor]&.to_i || RETRY_BACKOFF_FACTOR
    options[:retry_methods] = RETRY_METHODS
    options[:retry_statuses] = RETRY_STATUSES
    options[:retry_exceptions] = RETRY_EXCEPTIONS
  end

  def create(record)
    status, response = connection.post(record_api_path(record), params(record))
    raise ApiConnector::UnsuccessfulResponseError.new(status, response) if SUCCESSFUL_STATUSES.exclude?(status)

    { status:, response: }
  end

  def record_api_path(record)
    PRIMERO_RECORD_API_PATH[record['record_type']]
  end

  def params(record)
    { 'data' => record['data'] }
  end
end
