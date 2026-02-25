# frozen_string_literal: true

# Raised when the server responds with an unsuccessful status code
class ApiConnector::UnsuccessfulResponseError < StandardError
  def initialize(status, response)
    super("The server responded with status #{status} and response #{response}")
  end
end
