# frozen_string_literal: true

# This middleware will return HTTP 429 once the rate limit is exceeded

post_rate_limit = ENV.fetch('PRIMERO_API_POST_RATE_LIMIT', 10)
return unless post_rate_limit.positive?

# Restrict the number of POST requests per IP per minute
Rack::Attack.throttle('POST Requests', limit: post_rate_limit, period: 60) do |request|
  next unless request.post?

  request.remote_ip
end
