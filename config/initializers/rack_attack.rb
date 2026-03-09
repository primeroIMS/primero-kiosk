# frozen_string_literal: true

# This middleware will return HTTP 429 once the rate limit is exceeded

post_rate_limit = ENV.fetch('PRIMERO_API_POST_RATE_LIMIT', 10)
return unless post_rate_limit.positive?

# Restrict the number of POST requests per IP per minute
# Note that you need to make sure that your reverse proxy is correctly setting the origin IP.
# Azure Gateways set the header X-Forwarded-For to the format IP:PORT which isn't handled by the
# ActionDispatch::RemoteIp middleware. Make sure that header is set to just the remote IP.
Rack::Attack.throttle('POST Requests', limit: post_rate_limit, period: 60) do |request|
  next unless request.post?

  request.remote_ip
end
