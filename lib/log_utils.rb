# frozen_string_literal: true

class LogUtils
  def self.thread_id
    Thread.current.object_id
  end

  def self.remote_ip(request)
    request.headers['HTTP_X_REAL_IP'].presence || request.headers['HTTP_X_FORWARD_FOR'].presence || request.remote_ip
  end
end
