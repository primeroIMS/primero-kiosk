# frozen_string_literal: true

# API to fetch the settings driving Primero
class Api::SystemSettingsController < ApplicationApiController
  def index
    @system_setting = SystemSettings.current
  end
end
