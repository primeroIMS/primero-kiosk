# frozen_string_literal: true

# Define an application-wide content security policy
# For further information see the following documentation
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy

return if ActiveRecord::Type::Boolean.new.cast(ENV.fetch('SKIP_CSP', nil)) || false

base_sources = %i[self]
turnstile_source = 'https://challenges.cloudflare.com'
dev_http_sources = %w[http://localhost:5100 http://localhost:5173 http://localhost:3036]

storage_sources =
  case ENV.fetch('PRIMERO_STORAGE_TYPE', nil)
  when 'microsoft'
    base_sources + ["https://#{ENV.fetch('PRIMERO_STORAGE_AZ_ACCOUNT', nil)}.blob.core.windows.net"]
  else
    base_sources
  end

script_sources = base_sources.dup
style_sources = base_sources.dup
connect_sources = base_sources.dup
font_sources = base_sources + %i[data]
img_sources = storage_sources + %i[data blob]
media_sources = storage_sources + %i[data blob]
worker_sources = base_sources.dup + %i[blob]
manifest_sources = base_sources.dup
frame_sources = base_sources.dup

if Rails.env.development?
  script_sources += dev_http_sources + ["'unsafe-inline'"]
  style_sources += dev_http_sources + ["'unsafe-inline'"]
  worker_sources += dev_http_sources
  connect_sources += dev_http_sources + %w[ws://localhost:5100 ws://localhost:5173 ws://localhost:3036]
end

if Rails.application.config.captcha_enabled
  script_sources << turnstile_source
  connect_sources << turnstile_source
  frame_sources << turnstile_source
end

Rails.application.config.content_security_policy do |policy|
  policy.default_src(*base_sources)
  policy.base_uri(:self)
  policy.form_action(:self)
  policy.frame_ancestors(:none)
  policy.object_src(:none)
  policy.frame_src(*frame_sources)
  policy.manifest_src(*manifest_sources)
  policy.worker_src(*worker_sources)
  policy.connect_src(*connect_sources)
  policy.font_src(*font_sources)
  policy.img_src(*img_sources)
  policy.media_src(*media_sources)
  policy.script_src(*script_sources)
  policy.style_src(*style_sources)
end

# If you are using UJS then enable automatic nonce generation
Rails.application.config.content_security_policy_nonce_generator = ->(_request) { SecureRandom.base64(16) }
Rails.application.config.content_security_policy_nonce_directives =
  Rails.env.development? ? [] : %w[style-src script-src]

# Report CSP violations to a specified URI
# For further information see the following documentation:
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only
Rails.application.config.content_security_policy_report_only = false
