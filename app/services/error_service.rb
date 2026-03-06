# frozen_string_literal: true

# Handles all exceptions for the API controllers so that they can be rendered.
class ErrorService
  # We have a simple switch statement to instantiate the various errors thrown by Primero
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def self.handle(error, request)
    case error
    when Errors::InvalidRecordJson
      code = 422
      errors = [
        ApplicationError.new(code: 422, message: error.message, resource: request.path, detail: error.invalid_props)
      ]
    when ActiveRecord::RecordInvalid
      code = 422
      errors = error.record.errors.messages.map do |field_name, message|
        ApplicationError.new(
          code: 422,
          message:,
          resource: request.path,
          detail: field_name.to_s
        )
      end
    else
      code = 500
      errors = [
        ApplicationError.new(
          code: 500,
          message: error.message,
          resource: request.path
        )
      ]
      Rails.logger.error error.backtrace.join("\n\t")
    end
    [code, errors]
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength
end
