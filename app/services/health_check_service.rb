# frozen_string_literal: true

# Validate basic Application health: in this case being able to access core dependencies
class HealthCheckService
  BACKENDS = %w[database server].freeze
  class << self
    def healthy?(backend = nil)
      return send("#{backend}_accessible?") if BACKENDS.include?(backend)

      database_accessible?
    end

    def server_accessible?
      true
    end

    def database_accessible?
      ActiveRecord::Base.connection.execute('SELECT 1;')
    rescue ActiveRecord::StatementInvalid, PG::ConnectionBad, ActiveRecord::ConnectionNotEstablished
      false
    end
  end
end
