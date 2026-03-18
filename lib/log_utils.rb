# frozen_string_literal: true

# Contains all log utils
class LogUtils
  def self.thread_id
    Thread.current.object_id
  end

  def self.remote_ip(request)
    request.remote_ip
  end
end
