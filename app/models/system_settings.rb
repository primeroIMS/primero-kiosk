class SystemSettings < ApplicationRecord
  after_initialize :set_version
  before_save :set_version

  store_accessor :system_options, :primero_version

  def set_version
    self.primero_version = PrimeroKiosk::Application::VERSION
  end

  def rtl_locales
    PrimeroKiosk::Application::RTL_LOCALES & I18n.available_locales
  end

  class << self
    def current(rebuild = false)
      return @current unless @current.nil? || rebuild

      @current ||=
        SystemSettings.first ||
        new
    end

    def reset
      @current = nil
    end
  end
end
