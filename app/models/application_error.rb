# frozen_string_literal: true

# Wrapper for an API/application error
class ApplicationError
  attr_accessor :code, :message, :resource, :detail, :headers

  def initialize(args = {})
    self.code = args[:code]
    self.message = args[:message]
    self.resource = args[:resource]
    self.detail = args[:detail]
    self.headers = args[:headers]
  end
end
