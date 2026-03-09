# frozen_string_literal: true

require "#{Rails.root}/app/middleware/xff_strip_port"

Rails.application.config.middleware.insert_before(ActionDispatch::RemoteIp, XffStripPort)
