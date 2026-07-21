# frozen_string_literal: true

# ApplicationController is the base controller for the application.
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
end
